const fs = require(`fs`);
const http = require(`http`);
const WebSocket = require(`ws`); // npm i ws

const board = [
  [
    "card back",
    "card rank-2 spades",
    "card rank-3 spades",
    "card rank-4 spades",
    "card rank-5 spades",
    "card rank-10 diams",
    "card rank-q diams",
    "card rank-k diams",
    "card rank-a diams",
    "card back",
  ],

  [
    "card rank-6 clubs",
    "card rank-5 clubs",
    "card rank-4 clubs",
    "card rank-3 clubs",
    "card rank-2 clubs",
    "card rank-4 spades",
    "card rank-5 spades",
    "card rank-6 spades",
    "card rank-7 spades",
    "card rank-a clubs",
  ],

  [
    "card rank-7 clubs",
    "card rank-a spades",
    "card rank-2 diams",
    "card rank-3 diams",
    "card rank-4 diams",
    "card rank-k clubs",
    "card rank-q clubs",
    "card rank-10 clubs",
    "card rank-8 spades",
    "card rank-k clubs",
  ],

  [
    "card rank-8 clubs",
    "card rank-k spades",
    "card rank-6 clubs",
    "card rank-5 clubs",
    "card rank-4 clubs",
    "card rank-9 hearts",
    "card rank-8 hearts",
    "card rank-9 clubs",
    "card rank-9 spades",
    "card rank-6 spades",
  ],

  [
    "card rank-9 clubs",
    "card rank-q spades",
    "card rank-7 clubs",
    "card rank-6 hearts",
    "card rank-5 hearts",
    "card rank-2 hearts",
    "card rank-7 hearts",
    "card rank-8 clubs",
    "card rank-10 spades",
    "card rank-10 clubs",
  ],

  [
    "card rank-a spades",
    "card rank-7 hearts",
    "card rank-9 diams",
    "card rank-a hearts",
    "card rank-4 hearts",
    "card rank-3 hearts",
    "card rank-k hearts",
    "card rank-10 diams",
    "card rank-6 hearts",
    "card rank-2 diams",
  ],

  [
    "card rank-k spades",
    "card rank-8 hearts",
    "card rank-8 diams",
    "card rank-2 clubs",
    "card rank-3 clubs",
    "card rank-10 hearts",
    "card rank-q hearts",
    "card rank-q diams",
    "card rank-5 hearts",
    "card rank-3 diams",
  ],

  [
    "card rank-q spades",
    "card rank-9 hearts",
    "card rank-7 diams",
    "card rank-6 diams",
    "card rank-5 diams",
    "card rank-a clubs",
    "card rank-a diams",
    "card rank-k diams",
    "card rank-4 hearts",
    "card rank-4 diams",
  ],

  [
    "card rank-10 spades",
    "card rank-10 hearts",
    "card rank-q hearts",
    "card rank-k hearts",
    "card rank-a hearts",
    "card rank-3 spades",
    "card rank-2 spades",
    "card rank-2 hearts",
    "card rank-3 hearts",
    "card rank-5 diams",
  ],

  [
    "card back",
    "card rank-9 spades",
    "card rank-8 spades",
    "card rank-7 spades",
    "card rank-6 spades",
    "card rank-9 diams",
    "card rank-8 diams",
    "card rank-7 diams",
    "card rank-6 diams",
    "card back",
  ],
];

const positionBoard = [
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
];

const deck = [
  "card rank-a spades",
  "card rank-2 spades",
  "card rank-3 spades",
  "card rank-4 spades",
  "card rank-5 spades",
  "card rank-6 spades",
  "card rank-7 spades",
  "card rank-8 spades",
  "card rank-9 spades",
  "card rank-10 spades",
  "card rank-j spades",
  "card rank-q spades",
  "card rank-k spades",
  "card rank-a clubs",
  "card rank-2 clubs",
  "card rank-3 clubs",
  "card rank-4 clubs",
  "card rank-5 clubs",
  "card rank-6 clubs",
  "card rank-7 clubs",
  "card rank-8 clubs",
  "card rank-9 clubs",
  "card rank-10 clubs",
  "card rank-j clubs",
  "card rank-q clubs",
  "card rank-k clubs",
  "card rank-a diams",
  "card rank-2 diams",
  "card rank-3 diams",
  "card rank-4 diams",
  "card rank-5 diams",
  "card rank-6 diams",
  "card rank-7 diams",
  "card rank-8 diams",
  "card rank-9 diams",
  "card rank-10 diams",
  "card rank-j diams",
  "card rank-q diams",
  "card rank-k diams",
  "card rank-a hearts",
  "card rank-2 hearts",
  "card rank-3 hearts",
  "card rank-4 hearts",
  "card rank-5 hearts",
  "card rank-6 hearts",
  "card rank-7 hearts",
  "card rank-8 hearts",
  "card rank-9 hearts",
  "card rank-10 hearts",
  "card rank-j hearts",
  "card rank-q hearts",
  "card rank-k hearts",
];

const divideDeckIntoPieces = (deck) => {
  let shuffled = deck
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
  const result = new Array(Math.ceil(shuffled.length / 6))
    .fill()
    .map((_) => shuffled.splice(0, 6));
  console.log(result);
  return result;
};


// code to read file
const readFile = (fileName) =>
  new Promise((resolve, reject) => {
    fs.readFile(fileName, `utf-8`, (readErr, fileContents) => {
      if (readErr) {
        reject(readErr);
      } else {
        resolve(fileContents);
      }
    });
  });

// code to create a server
const server = http.createServer(async (req, resp) => {
  console.log(`browser asked for ${req.url}`);
  if (req.url == `/mydoc`) {
    const clientHtml = await readFile(`client.html`);
    resp.end(clientHtml);
  } else if (req.url == `/myjs`) {
    const clientJs = await readFile(`client.js`);
    resp.end(clientJs);
  } else if (req.url == `/sequence.css`) {
    const sequenceCss = await readFile(`sequence.css`);
    resp.end(sequenceCss);
  } else {
    resp.end(`not found`);
  }
});


function findSequence(test, char){
  test = positionBoard
  
  max_col = test[0].length
  max_row = test.length
  
  let cols = [];
  let rows = [];
  let bdiag = [];
  let fdiag = [];
  
  for(let i = 0; i < max_col; i++){
      cols.push([])
  }
  
  for(let i = 0; i < max_row; i++){
      rows.push([])
  }
  
  for(let i = 0; i < max_row + max_col - 1; i++){
      fdiag.push([])
  }
  
  for(let i = 0; i < fdiag.length ; i++){
      bdiag.push([])
  }
  
  
  min_bdiag = -max_row + 1
  
  for(let x = 0; x < max_col; x++){
      for(let y = 0;y < max_row; y++){
          cols[x].push(test[y][x])
          rows[y].push(test[y][x])
          fdiag[x+y].push(test[y][x])
          bdiag[x-y-min_bdiag].push(test[y][x])
      }
  
  }
  
  function iterateOver(anyList){
      let found = false
      for(let lisInd = 0; lisInd < anyList.length; lisInd++){
          if (anyList[lisInd].length >= 5)
          {
              // console.log(anyList[lisInd])
              found = false
              for(let i = 0; i < (anyList[lisInd].length)-4; i++){
                  consgs = 0
                  for(let j = 0; j < 5; j++){
                      if (anyList[lisInd][i+j] == char)
                      {
                          consgs+=1
                          // console.log(consgs)
                          if(consgs == 5){
                              found = true
                              break
                          }  
                      }
                  }
                  if(found)
                      break
              }
              if(found){
                  break
              }
                 
          }
         
      }
      if(found){
          return true
      }
      else{
          return false
      }
  
  }
  
  
  // console.log(iterateOver(rows));
  // console.log(iterateOver(cols));
  // console.log(iterateOver(fdiag));
  // console.log(iterateOver(bdiag));
   
  if (iterateOver(rows) || iterateOver(cols) || iterateOver(fdiag) || iterateOver(bdiag))
      return true
  else{
      return false
  }
  }
  
// to listen for clients
server.listen(8000);

// creating a web socket
const wss = new WebSocket.Server({ port: 8080 });


const clients = new Map()
let clientId = 0;
let turn = 1;
let NoOfClicks = 0;
let numOfClientsNeedCards = 0;
let winningCondition = false;
let winner = "none";

wss.on('connection', (ws) => {
  clientId = clientId + 1;
  
  const id = clientId;

  if (id == 1 || id == 3)
  {
    color = 'green'
  }
  else{
    color = 'blue'
  }

  const clientInfo = {id, color};
  clients.set(ws, clientInfo);

  console.log(clientInfo)


  ws.on('message', (message) => {

    const ogMesg = JSON.parse(message);
    // console.log(ogMesg);

    if (ogMesg.data.type == 'cardClicked') { 
      
      NoOfClicks++;

      turn = (NoOfClicks + 1) % 4;

      if(turn == 0){turn = 4;}

      console.log("turn: ",turn);

      console.log("NoOfclicks: ",NoOfClicks);

      const rowIndexS = ogMesg.data.rowIndex;
      const columnIndexS = ogMesg.data.columnIndex; 
      // console.log("rowIndexS " + rowIndexS)
      // console.log("columnIndexS " + columnIndexS)
      // console.log(positionBoard)
      // console.log("positionBoard")


      if (clientInfo.color == "green")
      {
        positionBoard[rowIndexS][columnIndexS] = "g";
      }
      else if(clientInfo.color == "blue")
      {
        positionBoard[rowIndexS][columnIndexS] = "b";
      }

      if(ogMesg.data.needCards == true){
        numOfClientsNeedCards++;
        console.log("numOfClientsNeedCards: " + numOfClientsNeedCards)
      }
     
      let testGreen = findSequence(positionBoard, 'g')
      let testBlue = findSequence(positionBoard, 'b')

      if(testGreen == true){
        winningCondition = true
        winner = "Green"
      }
      else if(testBlue == true){
        winningCondition = true
        winner = "Blue"
      }
      
      // ws.send(JSON.stringify({
			// 	type: 'currentboard',
      //   TurnToPlay: turn, 
      //   positionBoard

      // }))


      // console.log(positionBoard)
      //the server will send it to the client and the client will replace the positionBoard with its newer versionthe server will send it to the client and the client will replace the positionBoard with its newer version

    }


   

    if(NoOfClicks == 24 && winningCondition == false){
      let i = 4;
      wss.clients.forEach((client) => { //test later possibly faulty
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'currentboard',
            TurnToPlay: turn, 
            winningCondition: false,
            cards: divideDeckIntoPieces(deck)[i],
            positionBoard
          }))
        }
        i++;
      })
    }
    else if (winningCondition == true)
    {
      wss.clients.forEach((client) => { //test later possibly faulty
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'currentboard',
            TurnToPlay: turn, 
            winningCondition: winningCondition,
            winner: winner,
            cards: [],
            positionBoard
          }))
        }
      })


    }
    else if (NoOfClicks == 48)
    {
      wss.clients.forEach((client) => { //test later possibly faulty
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'currentboard',
            TurnToPlay: turn, 
            winningCondition: "draw",
            cards: [],
            positionBoard
          }))
        }
      })
      // ws.disconnect();

    }
    else{
      wss.clients.forEach((client) => { //test later possibly faulty
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'currentboard',
            winningCondition: false,
            TurnToPlay: turn, 
            cards: [],
            positionBoard
          }))
        }
      })
    }

  })
  if(id == 4){
    let i = 0;
    
      for(let client of clients.keys()) {
        let myId = i + 1;
        client.send(JSON.stringify({
          type: 'newboard',
          board: board,
          positionBoard: positionBoard,
          cards: divideDeckIntoPieces(deck)[i],
          TurnToPlay: turn,
          myId: myId
        }))
        i++;
   
    }
  }

  
})
