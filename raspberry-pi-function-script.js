// begin code

d = msg.payload.d;

if (msg.command == "message") {
  msg.background = d.background;
  msg.color = d.color;
  msg.payload = d.message;
}
else if (msg.command == "alarm") {
  msg.payload = "*,*," + d.color;
}
else
  msg = null;
return msg;

// end code
