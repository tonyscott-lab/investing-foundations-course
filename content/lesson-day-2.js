window.IF_LESSON = {
  id: "day-2",
  day: 2,
  courseCode: "IF 102",
  title: "Companies, ownership, stocks, and shares",
  totalMinutes: 29,
  level: "Introductory",
  objectives: [
    "Explain what a business and company do and why growth often requires capital.",
    "Compare debt financing with equity financing without treating either as automatically better.",
    "Distinguish private companies from publicly traded companies.",
    "Explain precisely what stock, a share, a shareholder, and equity mean.",
    "Separate the roles of a company, broker, stock market, exchange, and the phrase Wall Street."
  ],
  sections: [
    {
      id: "welcome",
      title: "Begin with the business",
      module: "Section 1 of 7 · Business fundamentals",
      minutes: 4,
      outcome: "Identify the business activity before thinking about stocks or markets.",
      body: [
        "Renee and her adult son, Jordan, stop at Maple Street Market. Samira, the owner, wants to add a small kitchen so the market can sell prepared meals. The idea could serve customers and create revenue, but equipment, repairs, supplies, permits, and training must be handled before the first meal is sold.",
        "A business organizes people and resources to provide goods or services. A company is an organized business entity. In ordinary conversation the words often overlap, but the central idea is the same: the business does real work for customers. A stock certificate, brokerage app, or market price is not the business itself.",
        "Businesses use assets—resources such as cash, equipment, inventory, buildings, or useful rights—to operate. Revenue is money earned from sales before expenses are subtracted. Profit is what remains after relevant expenses. A growing business can have rising sales and still need cash because costs may arrive before revenue does."
      ],
      definitions: ["business", "company", "asset", "revenue", "profit"],
      keyIdea: "Start with the underlying business. Investing vocabulary makes more sense when you first understand what the company does, what resources it uses, and how it might earn money.",
      workedExample: {
        title: "A basic operating picture",
        body: "If Maple Street sells $8,000 of prepared meals in a month, that $8,000 is revenue—not automatically profit. Food, wages, utilities, insurance, and other expenses must be paid before Samira knows whether the kitchen produced a profit."
      },
      question: "If the kitchen may be valuable later but costs money now, where could the business obtain the capital to begin?",
      summary: "The company operates the business; sales, assets, expenses, and profit describe the business—not the stock-market screen.",
      alternate: "Picture a company as an operating system made of people, property, agreements, decisions, and customer relationships. A stock is a way to measure ownership in that operating system; it is not the system itself."
    },
    {
      id: "business",
      title: "How companies finance growth",
      module: "Section 2 of 7 · Capital and financing",
      minutes: 4,
      outcome: "Compare internal funds, borrowing, and selling ownership.",
      body: [
        "Samira estimates that the kitchen will require $40,000 before it opens. That money is capital: financial resources used to start, operate, or expand a business. A sound plan asks not only whether the idea is promising, but also how the required capital will be obtained.",
        "One path is internal financing: use cash the business has retained from earlier operations. A second path is debt financing: borrow money and agree to repay principal and usually interest. Debt does not give the lender ownership, but required payments can strain the business if results disappoint.",
        "A third path is equity financing: exchange an ownership interest for capital. Equity investors become owners and accept the possibility of gains or losses. The business generally does not promise to repay equity on a schedule the way it repays a loan. In return, existing owners give up part of the ownership claim.",
        "These choices can be combined. The important distinction is obligation versus ownership: debt creates a repayment obligation; equity divides ownership. Neither choice guarantees that the growth plan will succeed."
      ],
      definitions: ["capital", "debt", "equity", "revenue", "profit"],
      keyIdea: "Financing determines who supplies capital and what they receive: repayment rights under debt, or an ownership claim under equity.",
      workedExample: {
        title: "Two ways to obtain $40,000",
        body: "With a loan, Maple Street owes the agreed payments even if the kitchen has a weak month. With equity financing, a new owner shares in future results but also shares the risk of loss. The legal details can be complex, but the economic trade-off begins with repayment versus ownership."
      },
      whyItMatters: "When a headline says a company 'raised capital,' ask how. Borrowing and selling ownership affect the company and its owners differently.",
      practice: {
        id: "growth-money",
        concept: "business-growth",
        prompt: "Why might Maple Street need capital before opening its kitchen?",
        options: [
          {text: "Some resources must be paid for before the new operation begins earning revenue.", correct: true, feedback: "Correct. Equipment, repairs, inventory, and training can create cash needs before customers generate new revenue."},
          {text: "Every growing company is legally required to sell stock.", correct: false, feedback: "No. A company may use retained cash, debt, equity, or a combination. Many businesses never sell publicly traded stock."},
          {text: "Capital guarantees that the new operation will be profitable.", correct: false, feedback: "No. Capital makes the plan possible; it does not remove business risk or guarantee customer demand."}
        ]
      },
      summary: "Debt financing creates repayment obligations; equity financing exchanges capital for ownership.",
      alternate: "Debt is closer to renting money under a repayment agreement. Equity is closer to adding another owner. Both can supply capital, but the rights and risks are different."
    },
    {
      id: "ownership",
      title: "Private and publicly traded ownership",
      module: "Section 3 of 7 · Company ownership",
      minutes: 4,
      outcome: "Classify a company by how its ownership interests are held and traded.",
      body: [
        "Renee asks, 'If a company is public, does its building belong to the public?' No. Publicly traded describes how ownership shares can generally be bought and sold. It does not turn company property into a public park or public building.",
        "Ownership is a recognized claim on part or all of a business. A sole owner may hold the entire claim. Partnerships and corporations can divide ownership among multiple people or organizations. Owners may have economic rights, voting rights, or both, depending on the legal structure and type of ownership interest.",
        "A private company has ownership that is not generally offered for trading by the public on securities markets. Its owners might be founders, relatives, employees, or private investors. A publicly traded company has shares that members of the public can generally buy and sell through markets, subject to laws and market rules.",
        "Publicly traded does not mean evenly owned. A founder, institution, or other investor may still hold a large percentage. It also does not mean safer, better, or more profitable. The label describes the availability and trading of ownership shares."
      ],
      definitions: ["ownership", "private company", "publicly traded company"],
      keyIdea: "Private versus publicly traded describes the ownership market—not whether the company serves the public or whether its property is public.",
      workedExample: {
        title: "Same industry, different ownership",
        body: "Two grocery companies can sell similar products. One may be owned by a founder and several private investors. The other may have millions of shares traded publicly. Their products do not determine the classification; their ownership and trading arrangements do."
      },
      practice: {
        id: "public-private",
        concept: "public-private",
        prompt: "Which description fits a publicly traded company?",
        options: [
          {text: "Its shares can generally be bought and sold by members of the public through securities markets.", correct: true, feedback: "Correct. The key feature is that ownership shares are generally available for public market trading."},
          {text: "The public may freely use all of its buildings and equipment.", correct: false, feedback: "No. Company property remains company property. Public trading concerns shares, not public access to physical assets."},
          {text: "No person or institution may own a large percentage of it.", correct: false, feedback: "No. Public companies can still have concentrated ownership. The size of one owner's position does not determine whether shares are publicly traded."}
        ]
      },
      summary: "A public company has publicly tradable shares; a private company does not generally offer its ownership for public market trading.",
      alternate: "Think about who may enter the ownership marketplace, not who may enter the company’s building. Public trading opens access to trading shares; it does not open access to company property."
    },
    {
      id: "shares",
      title: "What one share actually represents",
      module: "Section 4 of 7 · Stock and proportional ownership",
      minutes: 5,
      outcome: "Explain a share as a proportional ownership unit and identify the rights and risks that may accompany it.",
      body: [
        "Samira places 20 identical tiles on the counter. 'Pretend these measure all the ownership,' she says. If the company had exactly 20 equal ownership units, one tile would represent 1 of 20 units, or 5 percent. It would not represent the stove, a shelf, or five percent of the floor.",
        "Stock is an ownership interest in a corporation. A share is one measured unit of that stock. A shareholder is a person or organization that owns shares. Equity is the broader idea of an ownership interest. The percentage represented by one share depends on the total number of relevant shares outstanding—not on the share’s dollar price.",
        "Shares can carry rights defined by law and the company’s governing documents. Some include voting rights. A company may choose to distribute part of its earnings through dividends, but dividends are not guaranteed. Different classes of stock may have different rights.",
        "Ownership also includes risk. A profitable, well-run company may become more valuable, but competition, debt, poor decisions, economic changes, or unexpected events can damage results. A share price can rise, fall, or become worthless."
      ],
      definitions: ["stock", "share", "shareholder", "equity", "dividend", "risk"],
      keyIdea: "A share measures a claim on the company as a whole. It does not assign a physical company asset to the shareholder.",
      workedExample: {
        title: "Percentage ownership depends on the denominator",
        body: "One share out of 20 equal shares represents 5 percent. One share out of 1,000 equal shares represents 0.1 percent. The phrase 'one share' is incomplete without knowing how many comparable shares exist."
      },
      visual: true,
      practice: {
        id: "share-means",
        concept: "share-ownership",
        prompt: "Jordan owns one share of a company. What does he own?",
        options: [
          {text: "A proportional ownership interest in the company as a whole.", correct: true, feedback: "Correct. The exact percentage depends on the total relevant shares, but the share is connected to the entire company."},
          {text: "One physical object selected from the company.", correct: false, feedback: "No. A share does not assign a chair, product, room, or machine to its owner."},
          {text: "A guarantee that the company will pay a dividend and the price will rise.", correct: false, feedback: "No. Dividends and gains are not guaranteed. Shareholders accept the possibility of loss."}
        ]
      },
      whyItMatters: "Understanding the denominator prevents a common mistake: assuming that one share always represents the same percentage or amount of influence.",
      summary: "A share is one unit of stock—proportional ownership in the whole company, with possible rights and real risk.",
      alternate: "A share is a legal measuring unit for ownership. It measures a portion of the whole enterprise while the company continues to use all of its property together."
    },
    {
      id: "market",
      title: "From company financing to market trading",
      module: "Section 5 of 7 · Markets, exchanges, and brokers",
      minutes: 6,
      outcome: "Trace the path from issuing shares to an investor’s market order.",
      body: [
        "Selling ownership can supply capital to a company. In a primary-market transaction, newly issued securities are sold and the issuer receives the proceeds, after applicable costs. This is the financing connection between a company and its stock.",
        "After shares are in investors’ hands, many later trades occur in the secondary market. In a typical secondary-market trade, one investor sells to another investor. The company usually does not receive the purchase price from each later trade. The trade changes who owns the shares.",
        "The stock market is the broad system in which stocks are issued and traded. A stock exchange is one organized trading venue with listing standards and trading rules. Other regulated trading venues also exist. An exchange is therefore part of the market, not a synonym for the entire market.",
        "An individual investor usually places an order through a broker or brokerage firm. The broker accepts and routes the customer order toward a venue where it may be executed. The company operates the business; the broker handles the customer relationship and order; the trading venue brings trading interest together under rules."
      ],
      definitions: ["primary market", "secondary market", "stock market", "stock exchange", "broker", "brokerage account", "listed stock"],
      keyIdea: "A company may receive capital when securities are issued. Most later market trades transfer existing shares between investors rather than sending the trade price to the company.",
      workedExample: {
        title: "Follow the money and the share",
        body: "If a company issues a new share for $20, that transaction can provide capital to the company. If an investor later sells that same share to another investor for $23, the seller generally receives the $23. The company still operates the business, but it is not normally the seller in that later trade."
      },
      practice: {
        id: "who-does-what",
        concept: "market-roles",
        prompt: "Renee wants to place an order for a publicly traded share. Who would usually accept her order?",
        options: [
          {text: "A broker or brokerage firm", correct: true, feedback: "Correct. A brokerage firm typically accepts the customer’s order and routes it toward an execution venue."},
          {text: "The company’s store cashier", correct: false, feedback: "No. A cashier handles customer purchases from the operating business, not public securities orders."},
          {text: "The stock market as if it were one company", correct: false, feedback: "No. The stock market is a broad system containing many participants and venues; it is not one company taking every order."}
        ]
      },
      whyItMatters: "This distinction helps you read market news accurately. A rising share price does not mean the company receives that price every time the stock trades.",
      summary: "The market is the broad system, an exchange is a trading venue, and a broker handles the customer’s order.",
      alternate: "Think of a ticket after its original sale. The first sale can fund the event organizer. A later resale transfers the ticket between two people. The organizer runs the event, while the resale platform helps the later trade occur."
    },
    {
      id: "wall-street",
      title: "Reading financial language critically",
      module: "Section 6 of 7 · Wall Street and market headlines",
      minutes: 3,
      outcome: "Interpret Wall Street as a physical place or a broader figure of speech, depending on context.",
      body: [
        "Jordan reads a headline: 'Wall Street reacts to company news.' The headline does not mean every person standing on one street made the same decision.",
        "Wall Street is a real street in New York City’s financial district, near the New York Stock Exchange. In everyday speech, its name is also used as shorthand for the U.S. financial industry, major financial firms, investors, or financial markets.",
        "That shorthand can hide important differences. Investors do not all agree, and 'the market' is not one person with one opinion. A careful reader asks which market measure changed, which participants were affected, and what evidence supports the headline."
      ],
      definitions: ["Wall Street"],
      keyIdea: "Financial headlines compress many participants and events into short phrases. Treat the phrase as a starting point, not a complete explanation.",
      workedExample: {
        title: "Translate the headline",
        body: "'Wall Street falls after earnings reports' usually means that one or more broad market indexes declined and commentators connected the move to company reports. It does not mean every stock declined or every investor reacted identically."
      },
      scenario: {
        id: "wall-street-headline",
        concept: "wall-street",
        prompt: "A headline says, 'Wall Street reacts to new company reports.' What is the clearest interpretation?",
        options: [
          {text: "The phrase broadly refers to financial markets or the financial industry.", correct: true, feedback: "Correct. The street’s name is being used as shorthand, and the details still require closer reading."},
          {text: "Every person on the physical street made the same decision.", correct: false, feedback: "No. The phrase is figurative and does not describe unanimous action by people on one block."},
          {text: "One company named Wall Street purchased all available shares.", correct: false, feedback: "No. Wall Street is not one company or one buyer."}
        ]
      },
      summary: "Wall Street can name a real place or serve as shorthand for finance and markets; context determines the meaning.",
      alternate: "It works like 'Hollywood' in a movie headline. The place is real, but its name often represents a much larger industry."
    },
    {
      id: "takeaway",
      title: "Build the complete mental model",
      module: "Section 7 of 7 · Synthesis and application",
      minutes: 3,
      outcome: "Explain how the business, ownership, financing, and trading systems connect without confusing their roles.",
      body: [
        "Maple Street Market gives us one connected framework. The company operates the business. Growth may require capital. Debt supplies capital through a repayment agreement; equity supplies capital in exchange for ownership. Stock divides corporate ownership into measurable units called shares.",
        "Private and publicly traded companies differ in how ownership shares are available and traded. When public shares trade later, brokers handle customer orders and trading venues help bring buyers and sellers together. Those later trades usually transfer shares between investors rather than directly financing the company.",
        "Why this matters: workplace retirement plans, financial news, and ordinary conversations use these words quickly. A clear mental model helps you ask better questions, identify exaggerated claims, and continue learning without confusing a company’s business with movements in its share price."
      ],
      definitions: ["company", "capital", "stock", "broker", "stock exchange"],
      keyIdea: "Keep five roles separate: the company operates; capital finances; stock measures ownership; brokers handle customer orders; venues organize trading.",
      workedExample: {
        title: "A complete explanation in four sentences",
        body: "The company runs the business. A share measures a proportional ownership claim in the company. A broker accepts an investor’s order. An exchange or other venue provides an organized system where the order may trade."
      },
      teachBack: "Without using money, explain this aloud: 'A share is not a company object. It is…' Then explain what changes when that share is sold to another investor—and what does not change inside the company.",
      confidence: true,
      summary: "You are ready for the assessment when you can explain the five roles without relying on memorized slogans.",
      alternate: "Use this sequence: business activity → need for capital → debt or ownership financing → shares → investor trading through brokers and venues."
    }
  ],
  recap: [
    "A company operates a business using people and assets to provide goods or services.",
    "Revenue is sales before expenses; profit is what remains after relevant expenses.",
    "Debt financing creates repayment obligations; equity financing exchanges capital for ownership.",
    "A share is one proportional ownership unit in the company as a whole—not a physical company object.",
    "Private versus publicly traded describes how ownership shares are held and made available for trading.",
    "Primary-market issuance can finance a company; most secondary-market trades transfer existing shares between investors.",
    "The stock market is the broad system, an exchange is a venue, and a broker handles the customer’s order.",
    "Wall Street is a real place and a common shorthand for finance or markets.",
    "Shares can gain or lose value. Dividends and investment gains are never guaranteed."
  ]
};
