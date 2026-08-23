
function $(id){return document.getElementById(id)}
function readImage(file,cb){
  if(!file){alert("Please choose an image first.");return}
  const r=new FileReader();
  r.onload=()=>{const img=new Image();img.onload=()=>cb(img);img.src=r.result};
  r.readAsDataURL(file)
}
function canvasBlob(canvas,type="image/png",quality=.9){
  return new Promise(resolve=>canvas.toBlob(resolve,type,quality))
}
function downloadBlob(data,name){
  if(!data){alert("Could not create the file.");return}
  const a=document.createElement("a");a.href=URL.createObjectURL(data);a.download=name;
  document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000)
}
