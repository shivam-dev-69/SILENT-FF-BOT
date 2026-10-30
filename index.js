
const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

const fs = require("fs");
const { Telegraf, Markup } = require("telegraf");
const https = require("https");
const { pipeline } = require("stream/promises");

const TOKEN = process.env.BOT_TOKEN;
const ADMIN_URL = "https://t.me/silentff69";
const IMAGES_DIR = path.join(__dirname, "images");


// ================= CONFIGURATION =================
if (!TOKEN) {
  console.error("❌ BOT_TOKEN missing hai. .env file check karo.");
  process.exit(1);
}

const bot = new Telegraf(TOKEN);


const imgPath = (filename) => path.join(IMAGES_DIR, filename);
const imageExists = (filename) =>
  Boolean(filename) && fs.existsSync(imgPath(filename));

async function saveTelegramAccountPhoto(ctx, filename) {
  const photos = ctx.message.photo;

  if (!Array.isArray(photos) || photos.length === 0) {
    throw new Error("Telegram photo nahi mili.");
  }

  const photo = photos[photos.length - 1];
  const fileUrl = await ctx.telegram.getFileLink(photo.file_id);

  await fs.promises.mkdir(IMAGES_DIR, { recursive: true });

  const safeFilename = path.basename(filename);
  const destination = path.join(IMAGES_DIR, safeFilename);

  await new Promise((resolve, reject) => {
    https
      .get(fileUrl, (response) => {
        if (response.statusCode !== 200) {
          response.resume();
          reject(new Error(`Photo download failed: ${response.statusCode}`));
          return;
        }

        pipeline(
          response,
          fs.createWriteStream(destination)
        ).then(resolve).catch(reject);
      })
      .on("error", reject);
  });

  return safeFilename;
}


const money = (amount) =>
  `₹${Number(amount).toLocaleString("en-IN")}`;

// ================= ACCOUNTS =================

const accounts = [
  {
    id: "001",
    name: "Premium Account",
    level: 65,
    rank: "Heroic",
    price: 499,
    image: "id001.jpg",
    description: "Premium collection account",
  },
  {
    id: "002",
    name: "Elite Account",
    level: 52,
    rank: "Master",
    price: 299,
    image: "id002.jpg",
    description: "Elite collection account",
  },
];

// ================= PRODUCTS =================

const products = {
  tools: [
    {
      id: "tool1",
      name: "👑 SILENT PRO PANEL (v4.2)",
      price: 199,
      features: [
       "✅ Silent Aim (Headshot 90%)",
        "✅ No Recoil (All Weapons)",
        "✅ ESP X-Ray (Players & Loot)",
        "✅ Speed Hack (100-500%)",
        "✅ Anti-Ban & Anti-Cheat Bypass",
        "✅ Lifetime Updates",
      ],
    },
    {
      id: "tool2",
      name: "🎯 HEADSHOT + AIMBOT",
      price: 50,
      features: [
        "✅ Auto-Headshot (Toggleable)",
        "✅ Crosshair Lock",
        "✅ No Spread",
        "✅ Smooth Aim Bot",
        "✅ Works on All Devices",
      ],
    },
    {
      id: "tool3",
      name: "👁️ ESP X WALL HACK HEADSHORT",
      price: 30,
      features: [
         "✅ Player Box ESP",
        "✅ Distance & Health Bar",
        "✅ Loot ESP",
        "✅ Team Color Coding",
        "✅ 3D Radar",
      ],
    },
    {
      id: "tool4",
      name: "⚡ NO RECOIL + AIM KILLER",
      price: 90,
      features: [
         "✅ Recoil Control Guide",
        "✅ Weapon Practice Tips",
        "✅ Aim Lock",
      ],
    },
    {
      id: "tool5",
      name: "🛡️ ANTI BAN PANEL AIMBOT + 99% HEADSHORT",
      price: 150,
      features: [
          "✅ Body to Head Aimbot",
        "✅ All devices Working ",
        "✅ Main id Safe Panel ",
      ],
    },
    {
      id: "tool6",
      name: "🚀 SPEED HACK + AIMBOT",
      price: 60,
      features: [
         "✅ Location",
        "✅ 80% Headshort Rate",
        "✅ Only red Number ",
      ],
    },
    {
      id: "tool7",
      name: "🎮 Bypass + Aimbot No recoli",
      price: 300,
      features: [
       "✅ Real ID use Push your Ranked ",
        "✅ Aim 90 % headshort rate",
        "✅ Bypass Activate",
      ],
    },
    {
      id: "tool8",
      name: "🤖 Fly Hack Aimbot + FYP ",
      price: 80,
      features: [
        "✅ All red Number",
        "✅ loaction all enemy",
        "✅ silent aim lock",
      ],
    },
    {
      id: "tool9",
      name: "🔮 Only Aimbot + Fyp ",
      price: 150,
      features: [
        "✅ Main id fully safe panel",
        "✅ Body to head panel",
        "✅ Location ",
      ],
    },
  ],

  cards: [
    {
      id: "card1",
      name: "Gaming Pro Card",
      price: 299,
      balance: "500,00💎Diamonds",
      expiryDate: "USE ONLY ONE TIME",
      image: "card1.jpg",
    },
    {
      id: "card2",
      name: "Battle Pass Elite",
      price: 499,
      balance: "2,000,00 💎 Diamonds",
      expiryDate: "USE ONLY ONE TIME",
      image: "card2.jpg",
    },
    {
      id: "card3",
      name: "Loot Box Booster",
      price: 799,
      balance: "90000 💎 Diamonds",
      expiryDate: "USE ONY ONE TIME",
      image: "card3.jpg",
    },
    {
      id: "card4",
      name: "VIP Card",
      price: 1200,
      balance: "1 lakh  💎 Diamonds",
      expiryDate: "USE ONY ONE TIME ",
      image: "card4.jpg",
    },
  ],

  vip: [
    { id: "vip1", name: "VIP Access", price: 20000 },
    { id: "vip2", name: "Premium VIP", price: 30000 },
  ],
};

/* ================ CATALOG STORAGE ================ */

const CATALOG_FILE = path.join(__dirname, "catalog.json");


function loadSavedCatalog() {
  try {
    if (!fs.existsSync(CATALOG_FILE)) return;

    const saved = JSON.parse(
      fs.readFileSync(CATALOG_FILE, "utf8")
    );

   if (
  Array.isArray(saved.accounts) &&
  saved.accounts.length > 0
) {
  accounts.splice(0, accounts.length, ...saved.accounts);
}
    if (Array.isArray(saved.cards)) {
      products.cards = saved.cards;
    }

    if (Array.isArray(saved.vip)) {
      products.vip = saved.vip;
    }

    console.log("✅ Saved catalog loaded.");
  } catch (error) {
    console.error("Catalog load error:", error.message);
  }
}

function saveCatalog() {
  fs.writeFileSync(
    CATALOG_FILE,
    JSON.stringify(
      {
        accounts: accounts,
        cards: products.cards,
        vip: products.vip,
      },
      null,
      2
    ),
    "utf8"
  );
}

loadSavedCatalog();
console.log("ACCOUNTS AFTER LOAD:", accounts.map(a => a.id));
loadSavedCatalog();

console.log(
  "ACCOUNTS AFTER LOAD:",
  accounts.map((a) => a.id)
);
const catalogSessions = new Map();


function adminCatalogMenu() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(
        "🎮 Manage Accounts",
        "admin:category:accounts"
      ),
    ],
    [
      Markup.button.callback(
        "💳 Manage Cards",
        "admin:category:cards"
      ),
    ],
    [
      Markup.button.callback(
        "👑 Manage VIP",
        "admin:category:vip"
      ),
    ],
    [
      Markup.button.callback(
        "⬅️ Admin Panel",
        "admin:back"
      ),
    ],
  ]);
}


function catalogCategoryMenu(category) {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback("➕ Add Product", `admin:add:${category}`),
    ],
    [
      Markup.button.callback("📋 View / Edit / Delete", `admin:list:${category}`),
    ],
    [
      Markup.button.callback("⬅️ Catalog Menu", "admin:catalog"),
    ],
  ]);
}

// ================= ADMIN PANEL =================

const ADMIN_ID = String(process.env.ADMIN_ID || "").trim();

function isAdmin(ctx) {
  return (
    /^\d+$/.test(ADMIN_ID) &&
    String(ctx.from?.id) === ADMIN_ID
  );
}

console.log("Admin ID loaded:", ADMIN_ID);

function isAdmin(ctx) {
  const telegramUserId = String(ctx.from?.id ?? "").trim();

  console.log("Admin check:", {
    configured: /^\d+$/.test(ADMIN_ID),
    userIdReceived: Boolean(telegramUserId),
    matches: telegramUserId === ADMIN_ID,
  });

  return (
    /^\d+$/.test(ADMIN_ID) &&
    telegramUserId === ADMIN_ID
  );
}

function adminMenu() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback("📦 Manage Catalog", "admin:catalog")
    ],
    [
      Markup.button.callback("📤 Upload File", "admin:upload")
    ],
    [
      Markup.button.callback("❌ Close Panel", "admin:close")
    ]
  ]);
}
// ================= MAIN MENU =================

function mainMenu() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(
        "🎮 FREE FIRE ACCOUNTS",
        "cat:accounts"
      ),
    ],
    [
      Markup.button.callback("🛠️ TOOLS", "cat:tools"),
      Markup.button.callback("💳 CARDS", "cat:cards"),
    ],
    [
      Markup.button.callback("👑 VIP ACCESS", "cat:vip"),
    ],
    [
      Markup.button.callback("🆘 HELP", "help"),
      Markup.button.callback("👤 MY ID", "myid"),
    ],
  ]);
}

function contactKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.url("👨‍💻 CONTACT ADMIN", ADMIN_URL),
    ],
    [
      Markup.button.callback("🏠 MAIN MENU", "home"),
    ],
  ]);
}

// ================= CARDS KEYBOARDS =================


function cardsMenuMarkup() {
  const rows = products.cards.map((card) => [
    Markup.button.callback(
      `💳 ${card.name} — ${money(card.price)}\n🪙 Balance: ${card.balance}`,
      `viewcard:${card.id}`
    ),
  ]);

  rows.push([
    Markup.button.callback("🏠 BACK TO MAIN MENU", "home"),
  ]);

  return Markup.inlineKeyboard(rows);
}

function cardDetailMarkup(cardId) {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(
        "🛒 BUY NOW",
        `buycard:${cardId}`
      ),
    ],
    [
      Markup.button.callback(
        "⬅️ BACK TO CARDS",
        "cat:cards"
      ),
    ],
    [
      Markup.button.callback(
        "🏠 BACK TO MAIN MENU",
        "home"
      ),
    ],
  ]);
}

function paymentScreenMarkup() {
  return Markup.inlineKeyboard([
    [
      Markup.button.url(
        "👨‍💻 CONTACT ADMIN",
        ADMIN_URL
      ),
    ],
    [
      Markup.button.callback(
        "🏠 BACK TO MAIN MENU",
        "home"
      ),
    ],
  ]);
}

// ================= ACCOUNT KEYBOARD =================

function accountKeyboard(account) {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(
        `🛒 BUY NOW • ${money(account.price)}`,
        `buyacc:${account.id}`
      ),
    ],
    [
      Markup.button.url("👨‍💻 CONTACT ADMIN", ADMIN_URL),
    ],
    [
      Markup.button.callback("🏠 MAIN MENU", "home"),
    ],
  ]);
}

// ================= WELCOME =================


 // ================= WELCOME =================

async function welcome(ctx) {
  const name = ctx.from?.first_name || "Player";

  const frames = [
    "🔴 SILENT FF BOT\n\n" +
      "╔════════════════════╗\n" +
      "   CYBERPUNK SYSTEM\n" +
      "╚════════════════════╝\n\n" +
      "⚡ INITIALIZING SYSTEM...\n" +
      "▰▱▱▱▱  20%",

    "🔴 SILENT FF BOT\n\n" +
      "⚡ CONNECTING TO SERVER...\n" +
      "▰▰▱▱▱  40%\n\n" +
      "🔐 Checking connection...",

    "🔴 SILENT FF BOT\n\n" +
      "⚡ LOADING PREMIUM MODULES...\n" +
      "▰▰▰▱▱  60%\n\n" +
      "🎮 Preparing dashboard...",

    "🔴 SILENT FF BOT\n\n" +
      "⚡ FINALIZING SYSTEM...\n" +
      "▰▰▰▰▱  80%\n\n" +
      "✅ Modules loaded",

    "🔴 SILENT FF BOT\n\n" +
      "▰▰▰▰▰  100%\n\n" +
      "✅ SYSTEM READY\n" +
      "🔓 CONNECTION ESTABLISHED",
  ];

  const message = await ctx.reply(frames[0]);

  for (let i = 1; i < frames.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, 650));

    try {
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        message.message_id,
        undefined,
        frames[i]
      );
    } catch (error) {
      console.warn("Intro animation frame skipped:", error.message);
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 400));

  await ctx.reply(
    "🔴 SILENT FF BOT\n\n" +
      `⚡ Welcome, ${name}!\n\n` +
      "🎮 Your gaming dashboard is ready.\n" +
      "💳 Browse cards and available products.\n" +
      "📩 Need help? Contact the admin.\n\n" +
      "━━━━━━━━━━━━━━━━━━\n" +
      "🔻 SELECT YOUR DESTINATION 🔻",
    mainMenu()
  );
}


// ================= ACCOUNT LIST =================


async function showAccounts(ctx) {
  await ctx.reply("🎮 AVAILABLE ACCOUNTS");

  for (const account of accounts) {
    const caption =
      `🎮 ${account.name}\n\n` +
      `🆔 Account ID: ${account.id}\n` +
      `📊 Level: ${account.level}\n` +
      `🏆 Rank: ${account.rank}\n` +
      `📝 ${account.description}\n` +
      `💰 Price: ${money(account.price)}\n\n` +
      "👇 Purchase details ke liye option select karein.";

    // TEMPORARY DEBUG LOG
    console.log("[IMAGE DEBUG]", {
      accountId: account.id,
      image: account.image,
      imagePath: imgPath(account.image),
      exists: imageExists(account.image),
    });

    if (imageExists(account.image)) {
      // TEMPORARY DEBUG LOG
      console.log("[IMAGE DEBUG] Sending photo to Telegram...");

      await ctx.replyWithPhoto(
        { source: imgPath(account.image) },
        {
          caption,
          ...accountKeyboard(account),
        }
      );
    } else {
      console.warn("Account image not found:", imgPath(account.image));

      await ctx.reply(
        `${caption}\n\n⚠️ Image file nahi mili: ${account.image}`,
        accountKeyboard(account)
      );
    }
  }
}


// ================= CATEGORY LISTS =================

async function showCategory(ctx, category) {
  if (category === "accounts") {
    await showAccounts(ctx);
    return;
  }

  if (category === "cards") {
    await ctx.reply(
      "💳 AVAILABLE CARDS\n\n" +
        "Select a card to see its image, price, balance and expiry date:",
      cardsMenuMarkup()
    );
    return;
  }

  const items = products[category];

  if (!items) {
    await ctx.reply("❌ Category nahi mili.", mainMenu());
    return;
  }

  const titles = {
    tools: "🛠️ TOOLS & GUIDES",
    vip: "👑 VIP ACCESS",
  };

  await ctx.reply(
    `${titles[category] || "📦 PRODUCTS"}\n\n👇 Available products:`
  );

  for (const item of items) {
    let messageText = "";

    if (category === "tools") {
      messageText = `🔥 ${item.name}\n\n`;

      if (item.features?.length) {
        messageText += item.features.join("\n") + "\n\n";
      }

      messageText +=
        `💰 Price: ${money(item.price)}\n\n` +
        "👇 Purchase information ke liye option select karein.";
    } else {
      messageText =
        `📦 ${item.name}\n` +
        `🆔 Product ID: ${item.id}\n` +
        `💰 Price: ${money(item.price)}`;
    }

    await ctx.reply(
      messageText,
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            `🛒 BUY • ${money(item.price)}`,
            `buyprod:${category}:${item.id}`
          ),
        ],
        [
          Markup.button.url("👨‍💻 CONTACT ADMIN", ADMIN_URL),
        ],
        [
          Markup.button.callback("🏠 MAIN MENU", "home"),
        ],
      ])
    );
  }

  if (category === "tools") {
    await ctx.reply(
      "📩 Product ke baare mein help chahiye?",
      contactKeyboard()
    );
  }
}

// ================= CARD DETAILS =================

async function showCardDetails(ctx, card) {
  const caption =
    "💳 CARD DETAILS\n\n" +
    `📛 Name: ${card.name}\n` +
    `💰 Price: ${money(card.price)}\n` +
    `🪙 Balance: ${card.balance}\n` +
    `📅 Expiry Date: ${card.expiryDate}\n\n` +
    "👇 BUY NOW par click karke payment details dekhein.";

  if (imageExists(card.image)) {
    await ctx.replyWithPhoto(
      { source: imgPath(card.image) },
      {
        caption,
        ...cardDetailMarkup(card.id),
      }
    );
  } else {
    console.warn("Card image not found:", imgPath(card.image));

    await ctx.reply(
      "⚠️ Card image nahi mili: " + card.image + "\n\n" + caption,
      cardDetailMarkup(card.id)
    );
  }
}

// ================= CARD PAYMENT QR =================

async function sendCardPayment(ctx, card) {
  const caption =
    "🛒 PURCHASE DETAILS\n\n" +
    `📛 Item: ${card.name}\n` +
    `💰 Amount Due: ${money(card.price)}\n` +
    `🪙 Bundle Value: ${card.balance}\n` +
    `📅 Expiry: ${card.expiryDate}\n\n` +
    "👇 Scan the QR code below to pay.\n\n" +
    "Payment ke baad receipt admin ko bhejein. " +
    "Payment verification manually hogi.";

  if (imageExists("payment-qr.png")) {
    await ctx.replyWithPhoto(
      { source: imgPath("payment-qr.png") },
      {
        caption,
        ...paymentScreenMarkup(),
      }
    );
  } else {
    console.warn("Payment QR not found:", imgPath("payment-qr.png"));

    await ctx.reply(
      "⚠️ Payment QR nahi mila.\n\n" + caption +
        "\n\nimages/payment-qr.png file check karein.",
      paymentScreenMarkup()
    );
  }
}

// ================= ACCOUNT PAYMENT =================

async function sendAccountPayment(ctx, account) {
  const caption =
    "🛒 PURCHASE DETAILS\n\n" +
    `🎮 Account: ${account.name}\n` +
    `🆔 Account ID: ${account.id}\n` +
    `💰 Amount: ${money(account.price)}\n\n` +
    "📷 QR scan karne se pehle receiver aur amount verify karein.\n" +
    "📩 Payment ke baad receipt admin ko bhejein.";

  if (imageExists("payment-qr.png")) {
    await ctx.replyWithPhoto(
      { source: imgPath("payment-qr.png") },
      {
        caption,
        ...paymentScreenMarkup(),
      }
    );
  } else {
    await ctx.reply(
      "⚠️ Payment QR nahi mila.\n\n" + caption,
      paymentScreenMarkup()
    );
  }
}

// ================= COMMANDS =================

bot.start(async (ctx) => {
  await welcome(ctx);
});
// ================= ADMIN COMMAND =================

bot.command("admin", async (ctx) => {
  if (!isAdmin(ctx)) {
    return ctx.reply("⛔ Access Denied! Admin only.");
  }

  return ctx.reply(
    "🔴 SILENT FF BOT — ADMIN PANEL\n\nSelect an option:",
    adminMenu()
  );
});

// ================= ADMIN BUTTONS =================


bot.action("admin:catalog", async (ctx) => {
  if (!isAdmin(ctx)) {
    return ctx.answerCbQuery("⛔ Access Denied");
  }

  await ctx.answerCbQuery();

  return ctx.reply(
    "📦 CATALOG MANAGEMENT\n\nChoose a category:",
    adminCatalogMenu()
  );
});

bot.action("admin:back", async (ctx) => {
  if (!isAdmin(ctx)) {
    return ctx.answerCbQuery("⛔ Access Denied");
  }

  await ctx.answerCbQuery();

  return ctx.reply(
    "🔴 SILENT FF BOT — ADMIN PANEL",
    adminMenu()
  );
});

bot.action(/^admin:category:(accounts|cards|vip)$/, async (ctx) => {
  if (!isAdmin(ctx)) {
    return ctx.answerCbQuery("⛔ Access Denied");
  }

  await ctx.answerCbQuery();

  const category = ctx.match[1];

  return ctx.reply(
    `📦 MANAGE ${category.toUpperCase()}\n\nSelect an action:`,
    catalogCategoryMenu(category)
  );
});


bot.action("admin:upload", async (ctx) => {
  if (!isAdmin(ctx)) {
    return ctx.answerCbQuery("⛔ Access Denied");
  }

  await ctx.answerCbQuery();
  return ctx.reply("📤 File Upload — next step mein setup karenge.");
});

bot.action(/^admin:add:(cards|vip)$/, async (ctx) => {
  if (!isAdmin(ctx)) {
    return ctx.answerCbQuery("⛔ Access Denied");
  }

  await ctx.answerCbQuery();

  const category = ctx.match[1];

  catalogSessions.set(String(ctx.from.id), {
    action: category === "vip" ? "add-vip-name" : "add-card-name",
    category,
  });

  return ctx.reply(
    category === "vip"
      ? "👑 Naye VIP product ka naam bhejo.\nCancel: /cancel"
      : "💳 Naye card ka naam bhejo.\nCancel: /cancel"
  );
});

/* ================ ACCOUNT CATALOG MENU ================ */

function accountAdminMenu() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(
        "➕ Add Account",
        "admin:add:accounts"
      ),
    ],
    [
      Markup.button.callback(
        "📋 View / Edit / Delete",
        "admin:list:accounts"
      ),
    ],
    [
      Markup.button.callback(
        "⬅️ Catalog Menu",
        "admin:catalog"
      ),
    ],
  ]);
}

bot.action("admin:category:accounts", async (ctx) => {
  if (!isAdmin(ctx)) {
    return ctx.answerCbQuery("⛔ Access Denied");
  }

  await ctx.answerCbQuery();

  return ctx.reply(
    "🎮 MANAGE FREE FIRE ACCOUNTS\n\nChoose an action:",
    accountAdminMenu()
  );
});

bot.action("admin:list:accounts", async (ctx) => {
  if (!isAdmin(ctx)) {
    return ctx.answerCbQuery("⛔ Access Denied");
  }

  await ctx.answerCbQuery();

console.log("ACCOUNT LIST CHECK:", accounts.map(a => a.id));
  if (accounts.length === 0) {
    return ctx.reply(
      "📭 Koi account available nahi hai.",
      accountAdminMenu()
    );
  }
  console.log(
  "ACCOUNT IMAGES CHECK:",
  accounts.map((a) => ({
    id: a.id,
    image: a.image,
    exists: imageExists(a.image),
    path: a.image ? imgPath(a.image) : null,
  }))
);

  await ctx.reply("📋 FREE FIRE ACCOUNTS");

  for (const account of accounts) {
    await ctx.reply(
      `🎮 ${account.name}\n\n` +
        `🆔 ID: ${account.id}\n` +
        `📊 Level: ${account.level}\n` +
        `🏆 Rank: ${account.rank}\n` +
        `💰 Price: ${money(account.price)}\n` +
        `🖼️ Image: ${account.image || "Not set"}\n` +
        `📝 ${account.description}`,
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "✏️ Edit Account",
            `admin:edit:accounts:${account.id}`
          ),
        ],
        [
          Markup.button.callback(
            "🗑️ Delete Account",
            `admin:delete:accounts:${account.id}`
          ),
        ],
      ])
    );
  }

  return ctx.reply(
    "Manage accounts:",
    accountAdminMenu()
  );
});

/* ================ EDIT ACCOUNT START ================ */

bot.action(/^admin:edit:accounts:([a-zA-Z0-9_-]+)$/, async (ctx) => {
  if (!isAdmin(ctx)) {
    return ctx.answerCbQuery("⛔ Access Denied");
  }

  await ctx.answerCbQuery();

  const id = ctx.match[1];
  const account = accounts.find((item) => String(item.id) === String(id));

  if (!account) {
    return ctx.reply("❌ Account nahi mila.");
  }

  const key = String(ctx.from.id);

  catalogSessions.set(key, {
    action: "account-edit",
    step: 0,
    accountId: id,
    data: {
      name: account.name,
      level: account.level,
      rank: account.rank,
      price: account.price,
      image: account.image || "",
      description: account.description || "",
    },
  });

  return ctx.reply(
    "✏️ EDIT FREE FIRE ACCOUNT\n\n" +
    `Current name: ${account.name}\n` +
    "Pehle naya account name bhejein.\n\n" +
    "Cancel karne ke liye /cancel bhejein."
  );
});

/* ================ EDIT ACCOUNT END ================ */

bot.action(/^admin:delete:accounts:([a-zA-Z0-9_-]+)$/, async (ctx) => {
  if (!isAdmin(ctx)) {
    return ctx.answerCbQuery("⛔ Access Denied");
  }

  await ctx.answerCbQuery();

  const id = ctx.match[1];
  const account = accounts.find((item) => item.id === id);

  if (!account) {
    return ctx.reply("❌ Account nahi mila.");
  }

  return ctx.reply(
    `⚠️ Delete account?\n\n${account.name}\nID: ${account.id}\nPrice: ${money(account.price)}`,
    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          "✅ Confirm Delete",
          `admin:confirmdelete:accounts:${id}`
        ),
      ],
      [
        Markup.button.callback(
          "❌ Cancel",
          "admin:list:accounts"
        ),
      ],
    ])
  );
});


bot.action(/^admin:confirmdelete:accounts:([a-zA-Z0-9_-]+)$/, async (ctx) => {
  if (!isAdmin(ctx)) {
    return ctx.answerCbQuery("⛔ Access Denied");
  }

  await ctx.answerCbQuery();

  const id = String(ctx.match[1]);

  console.log("DELETE DEBUG:", {
    receivedId: id,
    savedIds: accounts.map((item) => String(item.id)),
    catalogFile: CATALOG_FILE,
  });

  const index = accounts.findIndex(
    (item) => String(item.id) === id
  );

  if (index === -1) {
    return ctx.reply(
      "❌ Account current list mein nahi mila.\n" +
      "Terminal ka DELETE DEBUG output check karein.",
      accountAdminMenu()
    );
  }

  const deletedAccount = accounts[index];

  accounts.splice(index, 1);

  try {
    saveCatalog();
  } catch (error) {
    accounts.splice(index, 0, deletedAccount);
    console.error("DELETE SAVE ERROR:", error.message);

    return ctx.reply(
      "❌ Account delete save nahi hua. Account list restore kar di gayi.",
      accountAdminMenu()
    );
  }

  console.log("DELETE SUCCESS:", id);

  return ctx.reply(
    `✅ Account delete aur save ho gaya.\nID: ${id}`,
    accountAdminMenu()
  );
});


/* ================ ADD ACCOUNT START ================ */

const accountFields = [
  { key: "name", label: "🎮 Account name bhejein:" },
  { key: "level", label: "📊 Account level bhejein (number):" },
  { key: "rank", label: "🏆 Account rank bhejein:" },
  { key: "price", label: "💰 Account price bhejein (rupees):" },
  { key: "image", label: "🖼️ Image filename bhejein, jaise id003.jpg. Skip karne ke liye - bhejein:" },
  { key: "description", label: "📝 Account description bhejein:" },
];

bot.action("admin:add:accounts", async (ctx) => {
  if (!isAdmin(ctx)) {
    return ctx.answerCbQuery("⛔ Access Denied");
  }

  await ctx.answerCbQuery();

  catalogSessions.set(String(ctx.from.id), {
    action: "account-add",
    step: 0,
    data: {},
  });

  return ctx.reply(
    "➕ ADD FREE FIRE ACCOUNT\n\n" +
      accountFields[0].label +
      "\n\nCancel karne ke liye /cancel bhejein."
  );
});

bot.command("cancel", async (ctx) => {
  const key = String(ctx.from.id);

  if (!catalogSessions.has(key)) {
    return ctx.reply("Koi active action nahi hai.");
  }

  catalogSessions.delete(key);

  return ctx.reply(
    "❌ Action cancel ho gaya.",
    accountAdminMenu()
  );
});


bot.on("text", async (ctx, next) => {
  const key = String(ctx.from.id);
  const session = catalogSessions.get(key);

  if (
    !session ||
    !["account-add", "account-edit"].includes(session.action)
  ) {
    return next();
  }

  if (!isAdmin(ctx)) {
    catalogSessions.delete(key);
    return ctx.reply("⛔ Access Denied");
  }

  const input = ctx.message.text.trim();

  if (input.startsWith("/")) return next();

  const field = accountFields[session.step];

  if (!field) {
    catalogSessions.delete(key);
    return ctx.reply("❌ Session error. Dobara try karein.");
  }

  if (field.key === "level" || field.key === "price") {
    if (!/^\d+$/.test(input) || Number(input) <= 0) {
      return ctx.reply("❌ Valid positive number bhejein.");
    }

    session.data[field.key] = Number(input);
  } else if (field.key === "image") {
    if (input === "-") {
      session.data.image = "";
    } else if (
      path.basename(input) !== input ||
      !/\.(jpg|jpeg|png|webp)$/i.test(input)
    ) {
      return ctx.reply(
        "❌ Sirf image filename bhejein, jaise id003.jpg.\nSkip: -"
      );
    } else {
      session.data.image = input;
    }
  } else {
    if (!input) {
      return ctx.reply("❌ Yeh field khaali nahi ho sakti.");
    }

    session.data[field.key] = input;
  }

  session.step += 1;

  if (session.step < accountFields.length) {
    return ctx.reply(
      accountFields[session.step].label + "\n\nCancel: /cancel"
    );
  }

  if (session.action === "account-add") {
    const account = {
      id: `acc${Date.now()}`,
      name: session.data.name,
      level: session.data.level,
      rank: session.data.rank,
      price: session.data.price,
      image: session.data.image || "",
      description: session.data.description,
    };

    accounts.push(account);
    saveCatalog();
    catalogSessions.delete(key);

    return ctx.reply(
      "✅ ACCOUNT SUCCESSFULLY ADDED!\n\n" +
        `🎮 Name: ${account.name}\n` +
        `🆔 ID: ${account.id}\n` +
        `📊 Level: ${account.level}\n` +
        `🏆 Rank: ${account.rank}\n` +
        `💰 Price: ${money(account.price)}\n\n` +
        "Catalog save ho gaya.",
      accountAdminMenu()
    );
  }

  const account = accounts.find(
    (item) => String(item.id) === String(session.accountId)
  );

  if (!account) {
    catalogSessions.delete(key);
    return ctx.reply("❌ Account nahi mila. Edit cancel kar diya.");
  }

  Object.assign(account, session.data);
  saveCatalog();
  catalogSessions.delete(key);

  return ctx.reply(
    "✅ ACCOUNT UPDATED!\n\n" +
      `🎮 Name: ${account.name}\n` +
      `🆔 ID: ${account.id}\n` +
      `📊 Level: ${account.level}\n` +
      `🏆 Rank: ${account.rank}\n` +
      `💰 Price: ${money(account.price)}\n\n` +
      "Catalog save ho gaya.",
    accountAdminMenu()
  );
});

bot.on("photo", async (ctx, next) => {
  const key = String(ctx.from.id);
  const session = catalogSessions.get(key);

  if (
    !session ||
    !["account-add", "account-edit"].includes(session.action)
  ) {
    return next();
  }

  if (!isAdmin(ctx)) {
    catalogSessions.delete(key);
    return ctx.reply("⛔ Access Denied");
  }

  const field = accountFields[session.step];

  if (!field || field.key !== "image") {
    return ctx.reply(
      "⚠️ Abhi text maanga gaya hai. Pehle current field complete karein."
    );
  }

  const filename =
    `account-${Date.now()}-${Math.floor(Math.random() * 10000)}.jpg`;

  try {
    await saveTelegramAccountPhoto(ctx, filename);

    session.data.image = filename;
    session.step += 1;

    if (session.step < accountFields.length) {
      return ctx.reply(
        "✅ Photo images folder mein save ho gayi!\n\n" +
        accountFields[session.step].label +
        "\n\nCancel: /cancel"
      );
    }

    return ctx.reply(
      "⚠️ Photo save ho gayi, lekin form ka agla step nahi mila. Admin se form check karwayein."
    );
  } catch (error) {
    console.error("Account photo upload error:", error.message);
    return ctx.reply(
      "❌ Photo save nahi hui. Dobara photo bhejein."
    );
  }
});

/* ================ ADD ACCOUNT END ================ */

bot.action("admin:close", async (ctx) => {
  if (!isAdmin(ctx)) {
    return ctx.answerCbQuery("⛔ Access Denied");
  }

  await ctx.answerCbQuery("Panel closed");
  return ctx.deleteMessage();
});
bot.command("help", async (ctx) => {
  await ctx.reply(
    "🆘 SILENT FF BOT HELP\n\n" +
      "• Accounts aur products menu se dekhein.\n" +
      "• Cards select karke unki details dekhein.\n" +
      "• BUY NOW se purchase details kholein.\n" +
      "• CONTACT ADMIN se support lein.\n" +
      "• Payment se pehle receiver aur amount verify karein.",
    mainMenu()
  );
});

// ================= BASIC BUTTONS =================

bot.action("help", async (ctx) => {
  await ctx.answerCbQuery();

  await ctx.reply(
    "🆘 Help ke liye admin se contact karein.",
    contactKeyboard()
  );
});

bot.action("myid", async (ctx) => {
  await ctx.answerCbQuery();

  await ctx.reply(
    `👤 Your Telegram ID: ${ctx.from.id}`,
    contactKeyboard()
  );
});

bot.action("home", async (ctx) => {
  await ctx.answerCbQuery();

  await ctx.reply(
    "🏠 SILENT FF BOT — MAIN MENU",
    mainMenu()
  );
});

// ================= CATEGORY BUTTONS =================

bot.action(/^cat:(accounts|tools|cards|vip)$/, async (ctx) => {
  await ctx.answerCbQuery();

  await showCategory(ctx, ctx.match[1]);
});

// ================= VIEW CARD =================

bot.action(/^viewcard:(card\d+)$/, async (ctx) => {
  await ctx.answerCbQuery();

  const card = products.cards.find(
    (item) => item.id === ctx.match[1]
  );

  if (!card) {
    await ctx.reply("❌ Card nahi mila.");
    return;
  }

  await showCardDetails(ctx, card);
});

// ================= BUY CARD =================

bot.action(/^buycard:(card\d+)$/, async (ctx) => {
  await ctx.answerCbQuery("Opening payment details...");

  const card = products.cards.find(
    (item) => item.id === ctx.match[1]
  );

  if (!card) {
    await ctx.reply("❌ Card nahi mila.");
    return;
  }

  await sendCardPayment(ctx, card);
});

// ================= BUY ACCOUNT =================

bot.action(/^buyacc:(.+)$/, async (ctx) => {
  await ctx.answerCbQuery("Opening purchase details...");

  const account = accounts.find(
    (item) => item.id === ctx.match[1]
  );

  if (!account) {
    await ctx.reply("❌ Account nahi mila.");
    return;
  }

  await sendAccountPayment(ctx, account);
});

// ================= BUY TOOLS / VIP =================

bot.action(/^buyprod:(tools|vip):(.+)$/, async (ctx) => {
  await ctx.answerCbQuery("Opening purchase details...");

  const [, category, productId] = ctx.match;

  const item = products[category]?.find(
    (product) => product.id === productId
  );

  if (!item) {
    await ctx.reply("❌ Product nahi mila.");
    return;
  }

  await ctx.reply(
    "🛒 PURCHASE INFORMATION\n\n" +
      `📦 Product: ${item.name}\n` +
      `🆔 Product ID: ${item.id}\n` +
      `💰 Price: ${money(item.price)}\n\n` +
      "Availability aur delivery details ke liye admin se contact karein.",
    contactKeyboard()
  );
});

// ================= ERROR HANDLER =================

bot.catch((error, ctx) => {
  console.error(
    `Bot error on update ${ctx.update?.update_id}:`,
    error.message || error
  );

  if (ctx.callbackQuery) {
    ctx.answerCbQuery("Error occurred. Please try again.", {
      show_alert: true,
    }).catch(() => {});
  }
});

// ================= START BOT =================

async function startBot() {
  try {
    console.log("🚀 Starting SILENT FF BOT...");

    const me = await bot.telegram.getMe();

    console.log(`✅ Telegram connected: @${me.username}`);

    await bot.telegram.deleteWebhook({
      drop_pending_updates: false,
    });

    await bot.launch();

    console.log(`🤖 @${me.username} is running.`);

    // Warn about missing card images without crashing the bot.
    for (const card of products.cards) {
      if (!imageExists(card.image)) {
        console.warn("Card image not found:", imgPath(card.image));
      }
    }

    if (!imageExists("payment-qr.png")) {
      console.warn("Payment QR not found:", imgPath("payment-qr.png"));
    }
  } catch (error) {
    console.error(
      "❌ Bot start nahi hua:",
      error.message || error
    );

    process.exitCode = 1;
  }
}

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

startBot();
