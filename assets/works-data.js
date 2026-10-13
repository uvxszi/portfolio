// Everything on the Works page comes from this list. Nothing else needs editing.
//
// Structure:  category (big tab)  >  tab (small tab)  >  items (the cards)
//
// A category:  { name: 'Software', color: 'teal', tabs: [ ... ] }
//              color is one of: teal, rust, ochre, blue, plum, moss
//
// A tab:       { name: 'Apps', items: [ ... ] }
//              leave items as [] and the tab shows "Nothing here yet."
//              items is a list: put as many items in it as you like, one after
//              another separated by commas, and they stack down the page.
//              Items go straight into the list; don't wrap them in another { name, items }.
//
// An item:     {
//                title: 'Name of the work',
//                summary: 'One or two sentences about it.',      (optional)
//                icon: '/assets/works/some-image.png',           (optional, always shown at 64 x 64)
//                links: [                                        (optional, one button per link)
//                  { label: 'Button text', url: 'https://example.com' },
//                ],
//              }
//
// The numbers on the tabs are counted automatically.

window.WORKS = [
  {
    name: 'Software',
    color: 'teal',
    tabs: [
      { name: 'Apps', items: [] },
      {
        name: 'Plug-ins & Add-ons',
        items: [
          {
            title: 'ZyBooks AutoUltra',
            summary: 'An extension that automates redundant participation activities in the ZyBooks website.',
            icon: '/assets/works/ZyBooks-AutoUltra-icon.png',
            links: [
              { label: 'Chrome Web Store', url: 'https://chromewebstore.google.com/detail/zybooks-autoultra/fohlegbagemcgbhmlneghanhllpidgla' },
              { label: 'Firefox Add-ons', url: 'https://addons.mozilla.org/en-US/firefox/addon/zybooks-autoultra/' },
            ],
          },
        ],
      },
      { name: 'Contributions', items: [] },
    ],
  },
  {
    name: 'Game Dev',
    color: 'rust',
    tabs: [
      { name: 'Games', items: [] },
      { name: 'Prototypes', items: [] },
      { name: 'Mods', items: [] },
      { name: 'Tools & Assets', items: [] },
    ],
  },
  {
    name: 'Writing & Research',
    color: 'ochre',
    tabs: [
      { name: 'Articles', items: [] },
      { name: 'Research Summaries', items: [] },
      { name: 'Guides', items: [] },
      { name: 'Editing', items: [] },
    ],
  },
  {
    name: 'Art',
    color: 'blue',
    tabs: [
      { name: 'Illustration', items: [] },
      { name: 'Pixel Art', items: [] },
      { name: '3D', items: [] },
      { name: 'Graphic Design', items: [] },
    ],
  },
  {
    name: 'Content Creation',
    color: 'plum',
    tabs: [
      { name: 'Videos', items: [] },
      { name: 'Video Editing', items: [] },
      { name: 'Short-form', items: [] },
      { name: 'Thumbnails', items: [] },
    ],
  },
  {
    name: 'Community',
    color: 'moss',
    tabs: [
      {
        name: 'Sayn',
        items: [
          {
            title: 'Sayn Website',
            summary: 'A website I created for fun.',
            icon: 'https://sayn.cc/sayn-icon-color-1x1.ico',
            links: [
              { label: 'sayn.cc', url: 'https://sayn.cc' },
              { label: 'Sayn Discord', url: 'https://discord.gg/fNu5HeV9Xj' },
              { label: 'r/sayn Subreddit', url: 'https://www.reddit.com/r/sayn/' }
            ],
          },
        ],
      },
      {
        name: 'Discord Servers & Subreddits',
        items: [
          {
            title: 'Strange Encounters Discord Server',
            summary: 'A Discord for all types of developers',
            icon: '/assets/works/strange-encounters-icon.png',
            links: [
              { label: 'Strange Encounters Discord', url: 'https://discord.gg/h4Hp2bKrHd' },
            ],
          },
        ],
      },
      { name: 'Events', items: [] },
    ],
  },
];
