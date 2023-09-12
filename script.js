const ctx = myCanvas.getContext("2d");

const offset ={
    x:myCanvas.width/2,
    y:myCanvas.height/2
};

const point = {x:90, y:120};
const G = {x:20, y:50};

ctx.translate(offset.x,offset.y);

update();
document.onmousemove=(event)=>{
    point.x=event.x - offset.x;
    point.y=event.y - offset.y;

    update();
}

function update(){
    ctx.clearRect(-offset.x, -offset.y,
        myCanvas.width,myCanvas.height);

    drawCoordinateSystem();

    // drawPoint(point);

    const{mag,dir}=toPolar(point);
    
    const same = toXY({mag,dir});
    // drawPoint(same,6,"red");
        
   

    const resultAdd = add(point, G);
    ctx.beginPath();
    ctx.setLineDash([3,3]);
    ctx.moveTo(G.x,G.y);
    ctx.lineTo(resultAdd.x,resultAdd.y);
    ctx.lineTo(point.x,point.y);
    ctx.stroke();
    ctx.setLineDash([]);
    drawArrow({x:0,y:0},resultAdd,"red")
    // drawArrow(point,resultAdd)
    // drawArrow(G,resultAdd)

    const resultSub = subtract(point,G);
    drawArrow({x:0,y:0}, resultSub,"red");
    drawArrow(G, point,"red");

    const scaledSub = scale(normalize(resultSub),50);
    drawArrow({x:0,y:0}, scaledSub,"red");

    console.log(Math.acos(dot(normalize(G), normalize(point))));

    drawArrow({x:0,y:0},point);
    drawArrow({x:0,y:0},G);
}

function drawArrow(tail,tip,color="white", size=20){
    const {dir,mag} = toPolar(subtract(tip,tail));
    const v1={dir:dir+Math.PI*0.8, mag:size/2};
    const p1 = toXY(v1);
    const t1= add(p1,tip);
    //drawPoint(t1);

    const v2={dir:dir-Math.PI*0.8, mag:size/2};
    const p2= toXY(v2);
   
    const t2=add(p2,tip);
    //drawPoint(t2);

    ctx.beginPath();
    ctx.moveTo(tail.x, tail.y);
    ctx.lineTo(tip.x,tip.y);
    ctx.strokeStyle=color;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(tip.x,tip.y);
    ctx.lineTo(t1.x,t1.y);
    ctx.lineTo(t2.x,t2.y);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle=color;
    ctx.fill();

}

function dot(p1,p2){
    return p1.x*p2.x+p1.y*p2.y;
}
function normalize(p){
    return scale(p,1/magnitude(p));
}

function scale(p, scaler){
    return{
        x:p.x*scaler,
        y:p.y*scaler
    };
}

function add(p1,p2){
    return {
        x:p1.x+p2.x,
        y:p1.y+p2.y
    };
}
function subtract(p1,p2){
    return {
        x:p1.x-p2.x,
        y:p1.y-p2.y
    };
}

function toXY({mag, dir}){
    return {
        x:Math.cos(dir)*mag,
        y:Math.sin(dir)*mag
    };
}
function toPolar({x,y}){
    return{
        dir:direction({x,y}),
        mag:magnitude({x,y})
    };
}
function direction({x,y}){
    return Math.atan2(y,x);
}

function magnitude({x,y}){
    return Math.hypot(x,y);
}

function drawPoint(loc,size=10, color="white"){
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(loc.x,loc.y,size/2,0,Math.PI*2);
    ctx.fill();
}

function drawCoordinateSystem(){
    ctx.beginPath();
    ctx.moveTo(-offset.x,0);
    ctx.lineTo(myCanvas.width-offset.x,0);
    ctx.moveTo(0,-offset.y);
    ctx.lineTo(0,myCanvas.height-offset.y);
    ctx.setLineDash([5,4]);
    ctx.lineWidth=2;
    ctx.strokeStyle="red";
    ctx.stroke();
    ctx.setLineDash([])
}

