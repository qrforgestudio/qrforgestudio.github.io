
$("file").onchange=()=>readImage($("file").files[0],img=>$("preview").innerHTML=`<img src="${img.src}" alt="Preview">`);
async function convertNow(){
  readImage($("file").files[0],async img=>{
    const c=document.createElement("canvas");c.width=img.width;c.height=img.height;
    c.getContext("2d").drawImage(img,0,0);
    const type=$("format").value,q=+$("quality").value;
    const b=await canvasBlob(c,type,q);
    $("preview").innerHTML="";$("preview").appendChild(c);
    const ext=type=="image/jpeg"?"jpg":type.split("/")[1];
    downloadBlob(b,"converted."+ext)
  })
}
