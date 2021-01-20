if(ISNW){
    
    const chokidar = require("chokidar");
    chokidar.watch([
        './pseudo-tests/popup-dodecahedron.html'
        ,'pseudo-tests/popup-dodecahedron.js'
    ]).on('change',()=>{location.reload(); });
}
const SVG_NS = "http://www.w3.org/2000/svg";
var svg = document.createElementNS(SVG_NS,'svg');
svg.setAttribute('xmlns',SVG_NS)
svg.setAttribute('id','svg')
document.body.appendChild(svg)

const gui = new dat.GUI()
const viewFolder = gui.addFolder('View');
const valueController = viewFolder.add({f:400},'f',300,1000,1).onChange((value)=>{
    svg.setAttribute("height", `${value}`)
})
gui.add(this,'exportSVG');

const sideLength = 50;

const Polyhedron = Platonic.Dodecahedron;

const isMarkingHinges = false;

const margin = 0;

const mmppx=3.7796;
function to_mm(value) {
    return mmppx*value
}

function onResize(params) {
    if(!isResizing)return
    const proportions = innerWidth / innerHeight;
    const isWider = proportions>1;
    // const bbox = svg.getBBox();
    // const tw = bbox.width + Math.abs(bbox.x);
    // const th = bbox.height + Math.abs(bbox.y);
    const {tw, th} = getSVGsize();
    const viewBoxString = `0 0 ${tw} ${th}`;
    svg.setAttribute("viewBox",viewBoxString)
    svg.removeAttribute("height")
    const h = isWider? innerHeight:innerWidth;
    // console.log('h: ', h);
    svg.setAttribute("height", `${h}`)
    valueController.setValue(h)
    
}

function getSVGsize(params) {
    const bbox = svg.getBBox();
    const tw = bbox.width + Math.abs(bbox.x);
    const th = bbox.height + Math.abs(bbox.y);
    return {tw,th}    
}

let hingedPolyhedron = new HingedPolyhedron({svg, gui, sideLength, Polyhedron,isMarkingHinges});
console.log('hingedPolyhedron: ', hingedPolyhedron);
hingedPolyhedron.addEventListener('update',onResize);
hingedPolyhedron.addEventListener('update',doUpdate);

let isResizing = true;

onResize()

const sides = 5;
const alpha = Math.PI * 2 / sides;
const beta = alpha / 2;
const popupGroup = document.createElementNS(SVG_NS, 'g');
svg.appendChild(popupGroup)
function draw_pentagon(sideSize) {
    const radius = sideSize / (2 * Math.sin(beta));
    console.log('radius: ', radius);
    const pentagon = document.createElementNS(SVG_NS, 'g');
    for (let i = 0; i < sides; i++) {
        const angle = i * alpha;
        const angle2 = (i+1) * alpha;
        const x1 = radius * Math.cos(angle);
        const y1 = radius * Math.sin(angle);
        const x2 = radius * Math.cos(angle2);
        const y2 = radius * Math.sin(angle2);
        const line = document.createElementNS(SVG_NS, 'line');
        line.setAttribute('x1',x1)
        line.setAttribute('y1',y1)
        line.setAttribute('x2',x2)
        line.setAttribute('y2',y2)
        line.setAttribute('stroke','black')
        pentagon.appendChild(line)
        
    }
    return pentagon;
}
function doUpdate(params) {
    popupGroup.innerHTML=""
    const pentagonWithHole = document.createElementNS(SVG_NS, 'g');
    const sideLength = hingedPolyhedron.sideLength;
    const pentagonInner = draw_pentagon(to_mm(sideLength));
    const pentagonOuter = draw_pentagon(to_mm(sideLength + thickness * tanBeta));
    pentagonWithHole.appendChild(pentagonInner)
    pentagonWithHole.appendChild(pentagonOuter)
    popupGroup.appendChild(pentagonWithHole);
    const pentagons = [pentagonWithHole];
    for (let i = 0; i < 11; i++) {
        const clone = pentagonWithHole.cloneNode(true);
        popupGroup.appendChild(clone);
        pentagons.push(clone);
    }
    console.log('pentagons: ', pentagons);
}
draw_pentagon(to_mm(hingedPolyhedron.sideLength))
const tanBeta = 2 * Math.tan(beta);
const thickness = 10;
doUpdate()