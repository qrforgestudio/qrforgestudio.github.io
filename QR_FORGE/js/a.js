
const qrTypes={
 text:"Plain Text",url:"Website / URL",wifi:"Wi-Fi",vcard:"Contact / vCard",
 email:"Email",sms:"SMS",tel:"Phone",geo:"Live Location / GPS",
 event:"Calendar Event",whatsapp:"WhatsApp",upi:"UPI Payment",bitcoin:"Bitcoin",custom:"Custom Data"
};
const qrFields={
 text:[["data","Text","textarea"]],url:[["data","Website URL","input"]],
 wifi:[["ssid","Network name","input"],["password","Password","input"],["security","Security","select",["WPA","WEP","nopass"]]],
 vcard:[["name","Full name","input"],["phone","Phone","input"],["email","Email","input"],["org","Organization","input"],["address","Address","input"]],
 email:[["to","Email","input"],["subject","Subject","input"],["body","Message","textarea"]],
 sms:[["phone","Phone","input"],["body","Message","textarea"]],tel:[["phone","Phone","input"]],
 geo:[["lat","Latitude","input"],["lon","Longitude","input"],["label","Location label","input"]],
 event:[["title","Title","input"],["start","Start YYYYMMDDTHHMMSS","input"],["end","End YYYYMMDDTHHMMSS","input"],["location","Location","input"],["description","Description","textarea"]],
 whatsapp:[["phone","Phone with country code","input"],["message","Message","textarea"]],
 upi:[["pa","UPI ID","input"],["pn","Payee name","input"],["am","Amount","input"],["tn","Note","input"]],
 bitcoin:[["address","Bitcoin address","input"],["amount","Amount","input"]],
 custom:[["data","QR data","textarea"]]
};
function renderQRFields(){
  const box=$("qfields");box.innerHTML="";
  (qrFields[$("qrtype").value]||[]).forEach(f=>{
    const l=document.createElement("label");l.textContent=f[1];box.appendChild(l);
    let e;
    if(f[2]=="textarea")e=document.createElement("textarea");
    else if(f[2]=="select"){e=document.createElement("select");f[3].forEach(x=>e.add(new Option(x,x)))}
    else e=document.createElement("input");
    e.id="q_"+f[0];box.appendChild(e);
  });
}
function qv(id){return $("q_"+id)?.value||""}
function makeQRData(){
  const t=$("qrtype").value;
  if(["text","url","custom"].includes(t))return qv("data");
  if(t=="wifi")return `WIFI:T:${qv("security")};S:${qv("ssid")};P:${qv("password")};;`;
  if(t=="vcard")return `BEGIN:VCARD\nVERSION:3.0\nFN:${qv("name")}\nTEL:${qv("phone")}\nEMAIL:${qv("email")}\nORG:${qv("org")}\nADR:;;${qv("address")}\nEND:VCARD`;
  if(t=="email")return `mailto:${qv("to")}?subject=${encodeURIComponent(qv("subject"))}&body=${encodeURIComponent(qv("body"))}`;
  if(t=="sms")return `SMSTO:${qv("phone")}:${qv("body")}`;
  if(t=="tel")return `tel:${qv("phone")}`;
  if(t=="geo")return `geo:${qv("lat")},${qv("lon")}?q=${encodeURIComponent(qv("label"))}`;
  if(t=="event")return `BEGIN:VEVENT\nSUMMARY:${qv("title")}\nDTSTART:${qv("start")}\nDTEND:${qv("end")}\nLOCATION:${qv("location")}\nDESCRIPTION:${qv("description")}\nEND:VEVENT`;
  if(t=="whatsapp")return `https://wa.me/${qv("phone").replace(/\D/g,"")}?text=${encodeURIComponent(qv("message"))}`;
  if(t=="upi"){
    const p=new URLSearchParams({pa:qv("pa"),pn:qv("pn"),cu:"INR"});
    if(qv("am"))p.set("am",qv("am"));if(qv("tn"))p.set("tn",qv("tn"));
    return "upi://pay?"+p.toString()
  }
  if(t=="bitcoin")return "bitcoin:"+qv("address")+(qv("amount")?"?amount="+encodeURIComponent(qv("amount")):"");
}
function getLiveLocation(){
  if(!navigator.geolocation)return alert("Geolocation is not supported by this browser.");
  navigator.geolocation.getCurrentPosition(p=>{
    if($("q_lat"))$("q_lat").value=p.coords.latitude.toFixed(7);
    if($("q_lon"))$("q_lon").value=p.coords.longitude.toFixed(7);
    if($("q_label"))$("q_label").value="My current location";
  },()=>alert("Location permission was denied or unavailable."),{enableHighAccuracy:true,timeout:15000,maximumAge:0})
}
function generateQR(){
  const data=makeQRData();if(!data)return alert("Enter the information first.");
  $("qrcode").innerHTML="";
  new QRCode($("qrcode"),{
    text:data,width:+$("size").value,height:+$("size").value,
    colorDark:$("fg").value,colorLight:$("bg").value,
    correctLevel:QRCode.CorrectLevel.M
  });
}
function downloadQR(){
  const img=$("qrcode").querySelector("img");
  if(!img)return alert("Generate a QR code first.");
  const a=document.createElement("a");a.href=img.src;a.download="qr-code.png";a.click()
}
