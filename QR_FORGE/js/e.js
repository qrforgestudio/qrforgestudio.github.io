
const compressionPurposes={
 custom:null,email:2,website:1,whatsapp:.5,passport:.2,form:.5,under1mb:1,under500kb:.5,under200kb:.2
};
function setCompressionPurpose(){
  const n=compressionPurposes[$("purpose").value];
  if(n){$("amount").value=n;$("unit").value="MB"}
}
function targetBytes(){
  return +$("amount").value*($("unit").value=="MB"?1048576:1024)
}
async function compressNow(){
  const f=$("file").files[0];if(!f)return alert("Choose an image first.");
  const target=targetBytes(),type=$("format").value;
  readImage(f,async img=>{
    let scale=1,lastBlob=null,lastCanvas=null;
    for(let round=0;round<12;round++){
      const c=document.createElement("canvas");
      c.width=Math.max(1,Math.round(img.width*scale));c.height=Math.max(1,Math.round(img.height*scale));
      c.getContext("2d").drawImage(img,0,0,c.width,c.height);
      let b;
      if(type=="image/png"){
        b=await canvasBlob(c,type);
      }else{
        let lo=.05,hi=1;
        for(let i=0;i<10;i++){
          const mid=(lo+hi)/2,test=await canvasBlob(c,type,mid);
          if(test.size<=target){b=test;lo=mid}else hi=mid
        }
        if(!b)b=await canvasBlob(c,type,.05)
      }
      lastBlob=b;lastCanvas=c;
      if(b.size<=target)break;
      scale*=.82
    }
    $("preview").innerHTML="";$("preview").appendChild(lastCanvas);
    $("status").textContent=`Result: ${(lastBlob.size/1024).toFixed(1)} KB • Target: ${(target/1024).toFixed(1)} KB`;
    const ext=type=="image/jpeg"?"jpg":type.split("/")[1];
    downloadBlob(lastBlob,"compressed."+ext)
  })
}
