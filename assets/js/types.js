var types = [
    /*
    Dismon Typings Database 1.0
        EXAMPLE ITEM
    {
            name: "NAME",
            noEffect: "",
            notVerEffect: "",
            supEffect: "",
         },
          ANY INFORMATION THAT IS INCORRECT NEEDS TO BE CHANGED.
          DESCRIPTIONS CAN ONLY BE ONE LINE. SEPERATE LINES WITH \n
          All unused Data needs to be removed.
          All the text before the { on each item needs to be removed.
          Needs to have a command created in the bot to access it.
          More information will be added if necessary
      */
     {
         name: "Normal",
         noEffect: "Ghost",
         notVerEffect: "Rock, Steel",
         supEffect: "None"
     },
     {
        name: "Fire",
        noEffect: "None",
        notVerEffect: "Fire, Water, Rock, Dragon",
        supEffect: "Grass, Ice, Bug, Steel"
     },
     {
        name: "Water",
        noEffect: "None",
        notVerEffect: "Water, Grass, Dragon",
        supEffect: "Fire, Ground, Rock"
     },
     {
        name: "Electric",
        noEffect: "Ground",
        noVerEffect: "Electric, Grass, Dragon",
        supEffect: "Water, Ground, Rock"
     },
     {
        name: "Grass",
        noEffect: "None",
        noVerEffect: "Fire, Grass, Poison, Flying, Bug, Dragon, Steel",
        supEffect: "Water, Ground, Rock"
     },
     {
        name: "Ice",
        noEffect: "None",
        noVerEffect: "Fire, Water, Ice, Steel",
        supEffect: "Grass, Ground, Flying, Dragon"
     },
     {
        name: "Fighting",
        noEffect: "Ghost",
        noVerEffect: "Poison, Flying, Psychic, Bug, Fairy",
        supEffect: "Normal, Ice, Rock, Dark, Steel"
     },
     {
        name: "Poison",
        noEffect: "Steel",
        noVerEffect: "Poison, Ground, Rock, Ghost",
        supEffect: "Grass, Fairy"
     },
     {
        name: "Ground",
        noEffect: "Flying",
        noVerEffect: "Grass, Bug",
        supEffect: "Fire, Electric, Poison, Rock, Steel"
     },
     {
        name: "Flying",
        noEffect: "None",
        noVerEffect: "Electric, Rock, Steel",
        supEffect: "Grass, Fighting, Bug"
     },
     {
        name: "Psychic",
        noEffect: "Dark",
        noVerEffect: "Psychic, Steel",
        supEffect: "Fighting, Poison"
     },
     {
        name: "Bug",
        noEffect: "None",
        noVerEffect: "Fire, Fighting, Poison, Flying, Ghost, Steel, Fairy",
        supEffect: "Grass, Psychic, Dragon"
     },
     {
        name: "Rock",
        noEffect: "None",
        noVerEffect: "Fighting, Ground, Steel",
        supEffect: "Fire, Ice, Flying, Bug"
     },
     {
        name: "Ghost",
        noEffect: "Normal",
        noVerEffect: "Dark",
        supEffect: "Psychic, Ghost"
     },
     {
        name: "Dragon",
        noEffect: "Fairy",
        noVerEffect: "Steel",
        supEffect: "Dragon"
     },
     {
        name: "Dark",
        noEffect: "None",
        noVerEffect: "Dark, Fairy",
        supEffect: "Psychic, Ghost"
     },
     {
        name: "Steel",
        noEffect: "None",
        noVerEffect: "Fire, Water, Electric, Steel",
        supEffect: "Ice, Rock, Fairy"
     },
     {
        name: "Fairy",
        noEffect: "None",
        noVerEffect: "Fire, Poison, Steel",
        supEffect: "Fighting, Dragon, Dark"
     }
];
module.exports = types;