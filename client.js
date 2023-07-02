const ws = new WebSocket(`ws://localhost:8080`);


function checkerSuit(string, diamondSign, heartSign, spadesSign, clubsSign){
  if (string.slice(-3,) == "des")
    return spadesSign;
  else if (string.slice(-3,) == "ams")
    return diamondSign;
  else if (string == "ubs")
    return clubsSign;
  else if (string.slice(-3,) == "rts")
    return heartSign;
  else
    return;

}
function checkerRank(string){
  if (string.split(" ")[1].slice(-2,-1) == "-")
    return string.split(" ")[1].slice(-1);
  else
    return string.split(" ")[1].slice(-2);

}


function cardClicked(string, cards, elemNo, colNum,turn, myId, winningCondition,messagebox, setMessage){ 
  //  console.log("turn: ",turn);
  //  console.log("myId: ",myId);
  let dupString = ""
  let jackInd = 0;
  let jack = false;
  let needCards = false;

if(winningCondition != "On going")  
{
  // alert("Game has concluded")
  setMessage("Game has concluded");
  return;
}

  if(turn == myId)
   { 
     for(let i=0; i<cards.length; i++)
     {
        dupString = cards[i].split(" ")[1];
        dupString = dupString.slice(-1);
        // console.log(dupString);

        if(dupString == "j")
        {
          jack = true;
          jackInd = i;
        }

        if (cards[i] == string)
        {
          setMessage("Nice Move");
        
        cards.splice(i, 1) //(remember that the cards array is being displayed as well, so it must update instantly!)

          if(cards.length == 0){
            needCards = true;
          }

          const message = {
            data: {
              type: 'cardClicked',
              rowIndex: elemNo,
              columnIndex: colNum,
              needCards: needCards
            }

          }
          // console.log(message)
          ws.send(JSON.stringify(message));
          return;
        }

    }
        if(jack)
        {
          cards.splice(jackInd, 1) //(remember that the cards array is being displayed as well, so it must update instantly!)

              if(cards.length == 0){
                needCards = true;
              }

              const message = {
                data: {
                  type: 'cardClicked',
                  rowIndex: elemNo,
                  columnIndex: colNum,
                  needCards: needCards
                }

              }
              // console.log(message)
              ws.send(JSON.stringify(message));
              return;
        }
        else
        {
          setMessage("Not a valid move");
           
        }
  }
  else{
    setMessage("Not your turn");
  }


}
const Sequence = () => {
  const [board, setBoard] = React.useState([[]]);
  const [positionBoard, setPositionBoard] = React.useState([[]]);
  const [cards, setCards] = React.useState([]);

  const [turn, setTurn] = React.useState(1);
  const [myId, setId] = React.useState(999);
  const [messagebox, setMessage] = React.useState("Good Luck");

  const [winningCondition, setwinningCondition] = React.useState("On going");



  let diamondSign = "♦";
  let heartSign = "♥";
  let spadesSign = "♠";
  let clubsSign = "♣";
  // let myId = 999;
  // let turn = 1;

  ws.onmessage = (event) => {
    const clientMessage = JSON.parse(event.data)
    console.log(clientMessage);
    if (clientMessage.type === `newboard`) {
        // console.log(clientMessage.board)
        setPositionBoard(clientMessage.positionBoard)
        setBoard(clientMessage.board)
        setCards(clientMessage.cards) 
        setTurn(clientMessage.TurnToPlay);
        setId(clientMessage.myId);

        // myId = clientMessage.myId
        //  console.log("myID: ", clientMessage.myId)

        
      }
      else if (clientMessage.type === `currentboard`){
        setPositionBoard(clientMessage.positionBoard);
        setTurn(clientMessage.TurnToPlay);
        
        if(clientMessage.cards.length != 0)
        {
          setCards(clientMessage.cards);
        }
        if(clientMessage.winningCondition == true){
          // let winner = clientMessage.winner;
          // console.log(winner, " Won")
          setwinningCondition(clientMessage.winner + " Team Wins") //risky
          ws.close();
        }
        if(clientMessage.winningCondition == "draw"){
          setwinningCondition(clientMessage.winningCondition)
          ws.close();
          // console.log("Draw")
        }
        // setTurn(clientMessage.takeTurn)

      }
    
    
    }

  return (
    <div>
      <div className="container">{
      // console.log("/* code for sequence board comes here */")

      board.map((c,colNum) => (
        
        // {console.log(c)}
        
        <div  className="playingCards fourColours rotateHand">
          <ul className="table">
           { c.map((elem, elemNo) => 
            (
       
            <div>
              
              {/* {console.log("myID: ", myId)} */}
              {(elem == "card back") ?  (<li><div className = {elem}> <span className="rank"></span> </div></li>) : ((positionBoard[elemNo][colNum] == "g") ? (<div className="card"><div className="green"></div></div>) : ((positionBoard[elemNo][colNum] == "b") ? (<div className="card"><div className="blue"></div></div>) : (<li><div onClick = { () => cardClicked(elem,cards, elemNo, colNum,turn, myId, winningCondition,messagebox,setMessage)} className = {elem}> <span className="rank">{checkerRank(elem)}</span><span className="suit">{checkerSuit(elem, diamondSign, heartSign, spadesSign, clubsSign)}</span></div></li>)))}
 

              </div>
            )
 
            )}
          </ul>
        </div>
      )
      )
      
      }</div>
      <div className="container">
        <div>
          <h1>Your Cards:</h1>
        </div>
        {
            <div className="playingCards fourColours rotateHand">
              <ul className="table">
               { cards.map((card,cardNum) => 
                (
                   
                  <li><a className = {card}><span className="rank">{checkerRank(card)}</span><span className="suit">{checkerSuit(card, diamondSign, heartSign, spadesSign, clubsSign)}</span></a></li>
              ))}
              </ul>
            </div>
        }
        {<div className = "text_box"> Turn to Play: Player# {turn} {'\n'} Current Status: {winningCondition} {'\n\n'} {"#"+messagebox} </div>}
        {<div className = "color green" ></div> }
      </div>
    </div>
  )
}

ReactDOM.render(<Sequence/>, document.querySelector(`#root`));

