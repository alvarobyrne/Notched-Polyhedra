class Hinge{
    constructor(svg,gui,dihedralDegree_,faceSidesAmount,w,dist,posx,type,isMarkingHinges){
        this.type=type;
        this.isMarkingHinges=isMarkingHinges;
        console.log('isMarkingHinges: ', isMarkingHinges);
        const dihedralDegree = dihedralDegree_;
        this.dihedralDegree = dihedralDegree;
        const doUpdate_ = () => this.update()
        gui.add(this,'dihedralDegree',0,150).name(`angle (${faceSidesAmount})`).onChange(doUpdate_);
        this.w=w;
        this.dist=dist;
        this.air = 5;
        this.original = document.createElementNS("http://www.w3.org/2000/svg",'g')
        var original = this.original;
        const margin=100;
        this.margin=margin;
        original.setAttribute('transform',`translate(${margin+posx},${0})`)
        svg.appendChild(original);
        this.update(20,20);
    }
    update(s,gap){
        if(s)this.s=s;
        if(gap)this.gap=gap
        if(!s)s=this.s;
        if(!gap)gap=this.gap;

        this.doHinge(s,gap)
    }
    doHinge(s,gap) {
        let isDebugging;
        isDebugging = true;
        isDebugging = false;
        var original = this.original;
        const dihedralDegree = this.dihedralDegree;
        const dihedral = dihedralDegree * Math.PI / 180;
        const c = Math.PI - dihedral;
        var width = this.w;
        var depth = s;
        let r = width * Math.cos(c);
        const b = dihedral * 0.5;
        const g = gap;
        const d = this.dist;
        const h = g + 2 * d;
        const invTan = 1 / Math.tan(b);
        const l = h * invTan;//see what & why in ../docs/dihedralAngle-hinge-formulae.svg
        const h1 = g +  d;
        const l1 = h1 * invTan;//see what & why in ../docs/dihedralAngle-hinge-formulae.svg
        const t = this.air;
        this.w = l1+ t+2*s;
        width = this.w;
        r = width * Math.cos(c);
        original.innerHTML = ""
        var triangleHint = document.createElementNS("http://www.w3.org/2000/svg", 'path')
        var pieceFullPath = document.createElementNS("http://www.w3.org/2000/svg", 'path')
        original.appendChild(triangleHint)
        original.appendChild(pieceFullPath);
        triangleHint.setAttribute('d', `M 0 0 h ${l} v ${h} z`);
        let points = [
            [0, 0], 
            [width, 0],
            [width,d],
            [width-depth,d],
            [width-depth,d+g],
            [width,d+g],
            [width,2*d+g],
            [l,2*d+g]
        ];
        let mirroredPoints = points
            .map(point=>[point[0],-point[1]])
        mirroredPoints.pop();
        mirroredPoints.reverse();
        let rotatedPoints = mirroredPoints
            .map(point => HingedPolyhedron.rotate2D(point, -dihedralDegree) );
        points =[...points,...rotatedPoints]
        points.pop();
        this.data = points;
        const dString = HingedPolyhedron.arrayToPath(points);
        rotatedPoints = rotatedPoints.join(" ")
        pieceFullPath.setAttribute('d', dString);
        triangleHint.setAttribute('stroke-width', '0.5')
        pieceFullPath.setAttribute('fill', 'none')
        triangleHint.setAttribute('stroke', 'black')
        pieceFullPath.setAttribute('stroke', 'red')
        if(!isDebugging)
        triangleHint.remove()
        if(this.isMarkingHinges)
            this.setMarksPath()
    }
    setMarksPath(){
        var marksPath = document.createElementNS("http://www.w3.org/2000/svg", 'path')
        var original = this.original;
        original.appendChild(marksPath);
        const type = this.type;
        let marksString=[]
        const marksSpace = 5;
        const marksSize = 10;
        const inity = 2;
        const initx = 5;
        for (let index = 0; index <= type; index++) {
            const x = (index+1) * marksSpace+initx;
            const markString=`M${x},${inity}L${x},${inity+marksSize}`
            marksString.push(markString)
        }
        marksString=marksString.join(' ')
        marksPath.setAttribute('stroke', 'blue')
        marksPath.setAttribute('d', marksString);

    }
}