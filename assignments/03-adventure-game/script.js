const rooms = {
    greatHall: {
        name: "The Great Hall",
        description: "You enter a grand hall with high ceilings and ornate decorations. " +
            "Hundreds of candles float beneath an enchanted " +
            "ceiling that shows the night sky. The Sorting Hat sits on a " +
            "stool at the front of the hall, and a long table stretches " +
            "down the center of the room. The table is set for a feast, " +
            "with plates of food and goblets of drink. It's your turn to " +
            "be sorted into a house. The Sorting Hat is placed on your " +
            "head, and you hear a voice in your mind: 'Ah, I see great " +
            "potential in you. But where will you belong?' " +
            "Choose your house.",
        linkedRooms: [
            { label: "Head to the Entrance Hall", destination: "entranceHall" }
        ]
    },
    entranceHall: {
        name: "The Entrance Hall",
        description: "You find yourself in a grand entrance hall, a huge stone space with marble staircases. " +
            "The walls are adorned with portraits of past headmasters and wizards, and doors lead in every direction: " +
            "back to the Great hall, out to the grounds, down to the dungeons, and up toward the Hospital Wing.",
        linkedRooms: [
            { label: "Return to the Great Hall", destination: "greatHall" },
            { label: "Go to the Grounds", destination: "grounds"}, 
            { label: "Go down to the Potions Classroom", destination: "potionsClassroom"},
            { label: "Go up to the Hospital Wing", destination: "hospitalWing"}
        ]
    },
    grounds: {
        name: "The Grounds",
        description: "A row of old school brooms lies on the grass. " +
            "Madam Hooch is waiting for the first-years to line up " +
            "for their first flying lesson. Harry Potter stands " +
            "next to you.",
        linkedRooms: [
            { label: "Go back inside to the Entrance Hall", destination: "entranceHall" },
            { label: "Fly to Hogsmeade", destination: "hogsmeade" }
        ]
    },
    hogsmeade: {
        name: "Hogsmeade",
        description: "Snow covers the rooftops of the little wizarding " +
            "village. The apothecary's shelves are stacked with jars " +
            "of potion ingredients.",
        linkedRooms: [
            { label: "Fly back to the Grounds", destination: "grounds" }
        ]
    },
    potionsClassroom: {
        name: "The Potions Classroom",
        description: "A cold dungeon lined with jars of strange things " +
            "floating in liquid. An empty cauldron sits on the " +
            "nearest table.",
        linkedRooms: [
            { label: "Climb back up to the Entrance Hall", destination: "entranceHall" }
        ]
    },
    hospitalWing: {
        name: "The Hospital Wing",
        description: "Rows of white beds stand neatly made. " +
            "Madam Pomfrey bustles between shelves of potions.",
        linkedRooms: [
            { label: "Leave for the Entrance Hall", destination: "entranceHall" }
        ]
    }
};

let currentRoom = "greatHall";

let house = "";
const houses = ["Gryffindor", "Hufflepuff", "Ravenclaw", "Slytherin"];

let harryInjured =  false;

const hoochLines = [
    "Madam Hooch strides down the line of students. \"Welcome to " +
        "your first flying lesson! Everyone find a broom and stand " +
        "beside it.\"",
    "You step up to a broom. Harry takes the one next to yours, " +
        "looking just as nervous as you feel.",
    "\"Hold your hand out over your broom,\" Madam Hooch calls, " +
        "\"and say it firmly: UP!\""
];

let hoochLine = 0;
let heardAllLines = false;

let inventory = [];

const ingredients = [
    {
        name: "Dittany Leaves",
        description: "A bundle of small, round leaves. They heal wounds."
    },
    {
        name: "Horklump Juice",
        description: "A small vial of pinkish juice, squeezed from a Horklump."
    }
];

let potionBrewed = false;

let gameOver = false;

let potionGiven = false;

let playerName = "";

const game = document.querySelector("#game");

const messageBox = document.querySelector("#message");

const inventoryBox = document.querySelector("#inventory");

function renderRoom(room) {
    game.innerHTML = "";

    const heading = document.createElement("h1");
    heading.innerHTML = room.name;

    const description = document.createElement("p");
    description.innerHTML = room.description;
    
    const buttons = document.createElement("div");

    if (currentRoom === "greatHall" && house === "") {
        for (let i = 0; i < houses.length; i++) {
            const button = document.createElement("button");
            button.innerHTML = houses[i];
            button.addEventListener("click", handleHouseClick);
            buttons.append(button);
        }
    } else {
        for (let i = 0; i < room.linkedRooms.length; i++) {
            const exit = room.linkedRooms[i];

            const button = document.createElement("button");
            button.innerHTML = exit.label;
            button.addEventListener("click", handleExitClick);

            if (exit.destination === "hogsmeade" && hasItem("Broom") === false) {
                button.classList.add("locked");
            }
            if (exit.destination === "hospitalWing" && harryInjured === false) {
                button.classList.add("locked");
            }
            
            buttons.append(button);
        }
    }

    game.append(heading);
    game.append(description);

    if (currentRoom === "grounds" && heardAllLines === false) {
        const line = document.createElement("p");
        line.innerHTML = hoochLines[hoochLine];

        const continueButton = document.createElement("button");
        continueButton.innerHTML = "Continue";
        continueButton.addEventListener("click", handleHoochClick);

        game.append(line);
        game.append(continueButton);
    }

    if (currentRoom === "grounds" && heardAllLines === true && hasItem("Broom") === false) {
        const spellPrompt = document.createElement("p");
        spellPrompt.innerHTML = "Hold your hand over the broom and say the spell:";

        const spellInput = document.createElement("input");

        const castButton = document.createElement("button");
        castButton.innerHTML = "Cast";
        castButton.addEventListener("click", handleCastClick);

        game.append(spellPrompt);
        game.append(spellInput);
        game.append(castButton);
    }

    if (currentRoom === "hogsmeade" && potionBrewed === false) {
        const shop = document.createElement("div");

        for (let i = 0; i < ingredients.length; i++) {
            if (hasItem(ingredients[i].name) === false) {
                const pickUpButton = document.createElement("button");
                pickUpButton.innerHTML = "Pick up " + ingredients[i].name;
                pickUpButton.addEventListener("click", handlePickUpClick);
                shop.append(pickUpButton);
            }
        }

        game.append(shop);
    }

    if (currentRoom === "potionsClassroom" && potionBrewed === false) {
        const brewButton = document.createElement("button");
        brewButton.innerHTML = "Brew Wiggenweld Potion";
        brewButton.addEventListener("click", handleBrewClick);

        if (hasItem("Dittany Leaves") === false || hasItem("Horklump Juice") === false) {
            brewButton.classList.add("locked");
        }

        game.append(brewButton);
    }

    if (currentRoom === "hospitalWing" && hasItem("Wiggenweld Potion") === true) {
        const giveButton = document.createElement("button");
        giveButton.innerHTML = "Give the potion to Harry";
        giveButton.addEventListener("click", giveHarryPotion);

        game.append(giveButton);
    }

    if (currentRoom === "hospitalWing" && potionGiven === true && gameOver === false) {
        const nameInput = document.createElement("input");

        const nameButton = document.createElement("button");
        nameButton.innerHTML = "Tell him your name";
        nameButton.addEventListener("click", handleNameClick);

        game.append(nameInput);
        game.append(nameButton);
    }

    if (gameOver === true) {
        const theEnd = document.createElement("h2");
        theEnd.innerHTML = "The End!";
        game.append(theEnd);
    } else {
        game.append(buttons);
    }
    renderInventory();
};

function showMessage(text) {
    messageBox.innerHTML = "";

    const box = document.createElement("div");

    const messageText = document.createElement("p");
    messageText.innerHTML = text;

    const okButton = document.createElement("button");
    okButton.innerHTML = "OK";
    okButton.addEventListener("click", closeMessage);

    box.append(messageText);
    box.append(okButton);
    messageBox.append(box);
};

function closeMessage() {
    messageBox.innerHTML = "";
};

function renderInventory() {
    inventoryBox.innerHTML = "";

    const title = document.createElement("h2");
    title.innerHTML = "Inventory";

    const list = document.createElement("ul");

    if (inventory.length === 0) {
        const emptyItem = document.createElement("li");
        emptyItem.innerHTML = "Empty";
        list.append(emptyItem);
    }

    for (let i = 0; i < inventory.length; i++) {
        const item = document.createElement("li");
        item.innerHTML = inventory[i].name;
        item.addEventListener("click", handleItemClick);
        item.addEventListener("mouseover", handleItemHover);
        list.append(item);
    }

    inventoryBox.append(title);
    inventoryBox.append(list);
};

function handleExitClick(event) {
    const clickedLabel = event.target.innerHTML;
    const exits = rooms[currentRoom].linkedRooms;

    for (let i = 0; i < exits.length; i++) {
        if (exits[i].label === clickedLabel) {
            if (exits[i].destination === "hospitalWing" && harryInjured === false) {
                showMessage("The Hospital Wing is quiet and empty. " +
                    "There's no reason to go in right now.");
            } else if (exits[i].destination === "hogsmeade" && hasItem("Broom") === false) {
                showMessage("Hogsmeade is miles away. You can't get " +
                    "there on foot. You'll need a broom.");
            } else {
                currentRoom = exits[i].destination;
                renderRoom(rooms[currentRoom]);
            }
            break;
        }
    }
};

function handleHouseClick(event) {
    house = event.target.innerHTML;

    showMessage("The Sorting Hat begins to ask you " +
        "questions, and you answer them honestly. After a few moments, " +
        "it makes its decision: 'You belong in " + house + "!' " +
        "You are sorted into " + house + ", and you feel a sense of " +
        "pride and excitement. You are ready to begin your journey " +
        "at Hogwarts.");

    rooms.greatHall.description = "The feast is over, and the long " +
        "tables are nearly empty. The Sorting Hat sits silent on its " +
        "stool at the front of the hall. A few of your new " + house +
        " housemates linger over the last of the pudding, but most " +
        "students have already headed off to class.";

    renderRoom(rooms[currentRoom]);
};

function handleHoochClick() {
    hoochLine = hoochLine + 1;

    if (hoochLine === hoochLines.length) {
        heardAllLines = true;
    }

    renderRoom(rooms[currentRoom]);
};

function hasItem(itemName) {
    for (let i = 0; i < inventory.length; i++) {
        if (inventory[i].name === itemName) {
            return true;
        }
    }
    return false;
};

function handleCastClick() {
    const spellInput = document.querySelector("input");
    const spell = spellInput.value.toUpperCase();

    if (spell === "UP" || spell === "UP!") {
        inventory.push({
            name: "Broom",
            description: "A worn old school broom. It flies a little to the left."
        });

        harryInjured = true;

        rooms.grounds.description = "The flying lesson is over. The grass " +
            "is empty except for a few scattered brooms and a deep scuff " +
            "mark where Harry hit the ground.";

        rooms.hospitalWing.description = "Harry lies in one of the white " +
            "beds, pale and wincing. Madam Pomfrey bustles over with a " +
            "list in her hand. 'I'm all out of Wiggenweld Potion. I need " +
            "Dittany leaves and Horklump juice from Hogsmeade. You have a " +
            "broom, so fly there, fetch them, and brew the potion in the " +
            "Potions Classroom. Quickly, now.'";

        currentRoom = "hospitalWing";

        showMessage("The broom leaps up into your hand! But next to you, " +
            "Harry's broom jerks into the air before he's ready. It bucks " +
            "and spins, and Harry crashes to the ground. Madam Hooch " +
            "points at you. 'You there! Help Harry to the Hospital Wing!' " +
            "You get Harry's arm over your shoulder and help him up to the " +
            "castle. Madam Pomfrey gasps when she sees you come in. " +
            "'Another flying lesson? Bring him over here, dear. Well done " +
            "getting him here.'");

        renderRoom(rooms[currentRoom]);
    } else {
        showMessage("The broom just rolls over in the grass. Try again.");
    }
};

function handlePickUpClick(event) {
    const clickedLabel = event.target.innerHTML;

    for (let i = 0; i < ingredients.length; i++) {
        if ("Pick up " + ingredients[i].name === clickedLabel && hasItem(ingredients[i].name) === false) {
            inventory.push(ingredients[i]);
            showMessage("You pick up the " + ingredients[i].name +
                " and tuck it safely into your robes.");
        }
    }

    renderRoom(rooms[currentRoom]);
};

function handleBrewClick() {
    const hasDittany = hasItem("Dittany Leaves");
    const hasHorklump = hasItem("Horklump Juice");

    if (hasDittany === false && hasHorklump === false) {
        showMessage("You have no ingredients to brew with.");
    } else if (hasDittany === false) {
        showMessage("You're still missing Dittany Leaves.");
    } else if (hasHorklump === false) {
        showMessage("You're still missing Horklump Juice.");
    } else {
        const remaining = [];
        for (let i = 0; i < inventory.length; i++) {
            if (inventory[i].name !== "Dittany Leaves" && inventory[i].name !== "Horklump Juice") {
                remaining.push(inventory[i]);
            }
        }
        inventory = remaining;

        inventory.push({
            name: "Wiggenweld Potion",
            description: "A bubbling green potion that heals injuries."
        });

        potionBrewed = true;

        rooms.potionsClassroom.description = "A cold dungeon lined with " +
            "jars of strange things floating in liquid. The cauldron on " +
            "the nearest table is scraped clean, and a faint green steam " +
            "still curls above it.";

        showMessage("You drop the Dittany Leaves and Horklump Juice into " +
            "the cauldron and stir carefully. The mixture bubbles, then " +
            "turns a bright, healthy green. You bottle the Wiggenweld " +
            "Potion. Time to get it to Harry!");
    }

    renderRoom(rooms[currentRoom]);
};

function handleItemClick(event) {
    const itemName = event.target.innerHTML;

    if (itemName === "Wiggenweld Potion" && currentRoom === "hospitalWing") {
        giveHarryPotion();
    } else if (itemName === "Wiggenweld Potion") {
        showMessage("Harry needs this. Get it to the Hospital Wing!");
    } else if (itemName === "Broom") {
        showMessage("Your trusty school broom. It still pulls a little to the left.");
    } else if (itemName === "Dittany Leaves" || itemName === "Horklump Juice") {
        showMessage("You'll need this for the potion. Take it to the Potions Classroom.");
    }
};

function handleItemHover(event) {
    const itemName = event.target.innerHTML;

    for (let i = 0; i < inventory.length; i++) {
        if (inventory[i].name === itemName) {
            showMessage(inventory[i].name + ": " + inventory[i].description);
        }
    }
};

function giveHarryPotion() {
    const remaining = [];
    for (let i = 0; i < inventory.length; i++) {
        if (inventory[i].name !== "Wiggenweld Potion") {
            remaining.push(inventory[i]);
        }
    }

    inventory = remaining;

    potionGiven = true;

    rooms.hospitalWing.description = "You hand Harry the Wiggenweld " +
        "Potion. He drinks it down in one gulp and makes a disgusted face, but " +
        "within seconds the color comes back to his cheeks. He sits " +
        "up and grins. 'Thanks, that's loads better.' Then he " +
        "pauses, looking a little embarrassed. 'Sorry... what was " +
        "your name again?'";

    renderRoom(rooms[currentRoom]);
};

function handleNameClick() {
    const nameInput = document.querySelector("input");
    playerName = nameInput.value;

    if (playerName === "") {
        showMessage("Harry is still waiting for an answer.");
    } else {
        gameOver = true;

        rooms.hospitalWing.description = "'Well, thank you, " +
            playerName + "!' Harry says. 'I owe you one. Next flying " +
            "lesson, you're keeping me on my broom.' Madam Pomfrey " +
            "bustles over and nods at you approvingly. 'Excellent work, " +
            playerName + ". Not many first-years could brew a " +
            "Wiggenweld on their own. Now off you go. This patient " +
            "needs his rest.'";

        renderRoom(rooms[currentRoom]);
    }
};

renderRoom(rooms[currentRoom]);