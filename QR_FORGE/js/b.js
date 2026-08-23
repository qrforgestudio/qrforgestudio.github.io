
const resizePresets={
 custom:null,"passport-india":[413,531],"visa-2x2":[600,600],
 "instagram-square":[1080,1080],"instagram-portrait":[1080,1350],
 youtube:[1280,720],linkedin:[400,400],whatsapp:[500,500],document:[2480,3508]
};
$("file").onchange=()=>readImage($("file").files[0],img=>{
  $("w").value=img.width;$("h").value=img.height;
  $("preview").innerHTML=`<img src="${img.src}" alt="Preview">`
});
function applyPreset(){
  const p=resizePresets[$("purpose").value];if(p){$("w").value=p[0];$("h").value=p[1]}
}
function resizeNow(){
  readImage($("file").files[0],img=>{
    const w=+$("w").value,h=+$("h").value;
    if(w<1||h<1)return alert("Enter valid dimensions.");
    const c=document.createElement("canvas");c.width=w;c.height=h;
    c.getContext("2d").drawImage(img,0,0,w,h);
    $("preview").innerHTML="";$("preview").appendChild(c);
    c.toBlob(b=>downloadBlob(b,"resized.png"))
  })
}
