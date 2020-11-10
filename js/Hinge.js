class Hinge{
    constructor(svg,gui,dihedralDegree_,faceSidesAmount,w,dist){
        const dihedralDegree = dihedralDegree_;
        this.dihedralDegree = dihedralDegree;
        const doUpdate_ = () => this.update()
        gui.add(this,'dihedralDegree',0,150).name(`angle (${faceSidesAmount})`).onChange(doUpdate_);
        this.w=w;
        this.dist=dist;
        this.original = document.createElementNS("http://www.w3.org/2000/svg",'g')
        var original = this.original;
        const margin=10;
        this.margin=margin;
        original.setAttribute('transform',`translate(${margin},${margin})`)
        svg.appendChild(original);
        this.update(20,20)
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
        // var width = this.w * mmppx;
        var width = this.w;
        // var depth = s * mmppx;
        var depth = s;
        const r = width * Math.cos(c);
        const b = dihedral * 0.5;
        // const g = gap * mmppx;
        const g = gap;
        // const d = this.dist * mmppx;
        const d = this.dist;
        const h = g + 2 * d;
        const l = h / Math.tan(b)//see what & why in ../docs/dihedralAngle-hinge-formulae.svg
        original.innerHTML = ""
        var triangleHint = document.createElementNS("http://www.w3.org/2000/svg", 'path')
        var pieceFullPath = document.createElementNS("http://www.w3.org/2000/svg", 'path')
        const gr = document.createElementNS("http://www.w3.org/2000/svg", 'g')
        original.appendChild(triangleHint)
        original.appendChild(gr);
        gr.appendChild(triangleHint);
        gr.appendChild(pieceFullPath);
        gr.setAttribute('transform', `translate(${r},0)`)
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
        const dString = HingedPolyhedron.arrayToPath(points)+" Z";
        rotatedPoints = rotatedPoints.join(" ")
        pieceFullPath.setAttribute('d', dString);
        triangleHint.setAttribute('stroke-width', '0.5')
        pieceFullPath.setAttribute('fill', 'none')
        triangleHint.setAttribute('stroke', 'black')
        pieceFullPath.setAttribute('stroke', 'black')
        if(!isDebugging)
        triangleHint.remove()
        var refelection = original.cloneNode(true);
        original.appendChild(refelection);
        const cloneTx = (2 * r + width + l);
        const cloneTy = h * 2 + 5
        this.cloneTx = cloneTx;
        this.cloneTy = cloneTy;
        refelection.setAttribute('transform', `rotate(180) translate(${-cloneTx},${-cloneTy})`);

        // refelection.setAttribute('stroke',`red`);
        // refelection.setAttribute('transform','rotate(180)');
    }

    doCloneHinges(params) {
        const margin=this.margin;

        var actualAmount= cloneAmount/2|0;
        for (let index = 1; index < actualAmount; index++) {
            const qiece = this.original.cloneNode(true);
            this.clones.appendChild(qiece);
            const u = index%columns
            const v = index/columns|0;
            // const x = u*(r+w+margin*0.5)+r+margin;
            const x = u*(cloneTx+margin)+margin;
            const y = v*(cloneTy+margin)+margin;
            qiece.setAttribute("transform",`translate(${x},${y})`)
        }
    }
}