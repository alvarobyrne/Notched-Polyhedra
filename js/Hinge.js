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
        var piece = document.createElementNS("http://www.w3.org/2000/svg", 'path')
        var pieceFullPath = document.createElementNS("http://www.w3.org/2000/svg", 'path')
        var mirrorPath = document.createElementNS("http://www.w3.org/2000/svg", 'path')
        var rotatedPath = document.createElementNS("http://www.w3.org/2000/svg", 'path')
        const gr = document.createElementNS("http://www.w3.org/2000/svg", 'g')
        original.appendChild(triangleHint)
        original.appendChild(gr);
        gr.appendChild(triangleHint);
        gr.appendChild(piece);
        gr.appendChild(pieceFullPath);
        if(false){
            gr.appendChild(mirrorPath);
            gr.appendChild(rotatedPath);
        }
        gr.setAttribute('transform', `translate(${r},0)`)
        triangleHint.setAttribute('d', `M 0 0 h ${l} v ${h} z`);
        piece.setAttribute('d', `M 0 0 h ${width} v ${d} h ${-depth} v${g} h ${depth} v ${d} h ${-(width - l)}`);
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
            .map(point => this.rotate2D(point, -dihedralDegree) );
        points =[...points,...rotatedPoints]
        const dString = this.arrayToPath(points);
        const mString = this.arrayToPath(mirroredPoints);
        const rString = this.arrayToPath(rotatedPoints);
        rotatedPoints = rotatedPoints.join(" ")
        pieceFullPath.setAttribute('d', dString);
        mirrorPath.setAttribute('d', mString);
        rotatedPath.setAttribute('d', rString);
        triangleHint.setAttribute('stroke-width', '0.5')
        pieceFullPath.setAttribute('fill', 'none')
        rotatedPath.setAttribute('fill', 'red')
        triangleHint.setAttribute('stroke', 'black')
        pieceFullPath.setAttribute('stroke', 'black')
        piece.setAttribute('stroke-width', '0.5')
        piece.setAttribute('fill', 'none')
        piece.setAttribute('stroke', 'black')
        const qiece = piece.cloneNode();
        gr.appendChild(qiece);
        if(!isDebugging)
        triangleHint.remove()
        qiece.setAttribute('transform', `scale(1,-1) rotate(${-dihedralDegree})`)
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

    rotate2D(vector, angle){
        var theta = angle * Math.PI / 180; // radians
        var matrix = [  
            Math.cos(theta),  Math.sin(theta), 
            -Math.sin(theta), Math.cos(theta)
        ];
        return [ 
            matrix[0] * vector[0] + matrix[1] * vector[1], 
            matrix[2] * vector[0] + matrix[3] * vector[1]
        ]
    }

    arrayToPath(points){
        const dString = ["M "+points[0][0]+" "+points[0][1]];
        for (let index = 1; index < points.length; index++) {
            const point = points[index];
            const pointString = "L " + point[0] + " " + point[1];
            dString.push(pointString)
        }
        return dString.join(" ")
    }
}