// begin code

msg.eventOrCommandType = msg.topic;
if (msg.topic == "alarm") {  
    msg.payload={d:{color:msg.payload}};
}
else if (msg.topic == "message") {  
    msg.payload={d:{color:"navy",
    background:"black",            
    message:msg.payload}};
}
else  msg = null;
return msg;

// end code
