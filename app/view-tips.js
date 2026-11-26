// view-tips.js — practical saving advice for the person running a household budget.

const TIPS = [
  {
    title: "Pay yourself first — on payday, not at month's end",
    body: "Set an automatic transfer of $800 to savings for the morning your salary lands. The Alvarez family saves $800 a month this way; when saving waits until the end of the month, it never happens.",
    save: "Saves about $800 a month, automatically",
  },
  {
    title: "One grocery list, one trip a week",
    body: "Plan five dinners on Sunday, write one list, and shop once. Every extra trip adds about $15 of things nobody planned to buy. A family of four that shops once a week instead of three times saves $50–$70 a month.",
    save: "Saves $50–$70 a month",
  },
  {
    title: "The 24-hour rule for anything over $50",
    body: "Want it? Wait a day. Most non-essential purchases over $50 stop feeling urgent by tomorrow morning. Put the money in the vacation goal instead and watch the bar move.",
    save: "Saves $40–$100 a month",
  },
  {
    title: "Cook the takeout favourites at home",
    body: "Pizza night for four costs $28.90 delivered and about $9 homemade. Two homemade pizza nights a month instead of delivery keeps the ritual and banks the difference.",
    save: "Saves about $40 a month",
  },
  {
    title: "Audit subscriptions once a season",
    body: "List every subscription — streaming, apps, boxes — and cancel anything nobody used in the last 30 days. The average household finds $25–$35 a month hiding here.",
    save: "Saves $25–$35 a month",
  },
  {
    title: "Buy groceries by the unit price, not the package",
    body: "The bigger bag is not always cheaper. Check the small print — dollars per ounce — on rice, oats, and cleaning supplies. Store brands beat name brands by 20–30% on staples.",
    save: "Saves $20–$30 a month",
  },
  {
    title: "Meal-prep the school lunches",
    body: "Packing lunches on Sunday evening costs about $2.50 a child per day, against $4.50 for the school lunch line. For two kids, that is $80 a month back in the budget.",
    save: "Saves about $80 a month",
  },
  {
    title: "Keep the car cheap: tire pressure and gentle starts",
    body: "Tires 5 PSI low burn about 2% more gas, and hard acceleration burns more still. Check pressure monthly and the family's $90-a-month gas bill drops by $10–$15.",
    save: "Saves $10–$15 a month",
  },
  {
    title: "Use the library like a store",
    body: "Books, movies, board games, museum passes — the public library lends all of it free. One family movie night swapped for a library movie night saves $38, and the kids pick the film.",
    save: "Saves $30–$40 a month",
  },
  {
    title: "Give every dollar a job before the month starts",
    body: "On the last Sunday of the month, sit down for 15 minutes and assign next month's income to categories — rent, groceries, fun, savings — until the leftover is zero. A budget decided in advance beats a budget discovered at the end.",
    save: "The habit that makes all the others work",
  },
];

export function render() {
  return `
  <h1>Saving tips that actually work</h1>
  <p class="lede">Ten habits a family of four can start this week — each one with a real dollar figure, so you can see which is worth doing first.</p>
  <div class="grid grid-2 mt">
    ${TIPS.map((t) => `<article class="card tip">
      <h3>${t.title}</h3>
      <p>${t.body}</p>
      <p class="save">${t.save}</p>
    </article>`).join("")}
  </div>
  <div class="callout mt">
    <strong>Start with one.</strong> Pick the tip with the biggest number, do it for two weeks, then add the next. Ten habits at once fail; one habit at a time sticks — and the Dashboard shows the result in real money.
  </div>`;
}

export function bind() {}
