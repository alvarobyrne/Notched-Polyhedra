class NotchedFace{
    constructor(svg,sidesAmount,isSingleNotch){
        this.isDebugging = true;
        this.isDebugging = false;
        this.facesDomContainer = document.createElement('div');
        document.body.appendChild(this.facesDomContainer);
        this.svgFaces = document.createElementNS("http://www.w3.org/2000/svg",'g');
        this.svgFaces.classList.add('face')
        this.facesDomContainer.appendChild(this.svgFaces);
        this.singleFacesGroup = document.createElementNS("http://www.w3.org/2000/svg",'g')
        this.singleFacesGroup.classList.add("single-face")
        svg.appendChild(this.singleFacesGroup);
        svg.appendChild(this.svgFaces);
        this.facesGroup = document.createElementNS("http://www.w3.org/2000/svg",'g');
        this.facesGroup.classList.add("faces-group")
        this.svgFaces.appendChild(this.singleFacesGroup);
        this.svgFaces.appendChild(this.facesGroup);
        if(this.isDebugging&&false){
            this.debugRect = document.createElementNS("http://www.w3.org/2000/svg",'rect');
            this.debugRect.setAttribute('width',20)
            this.debugRect.setAttribute('height',20)
            this.facesGroup.appendChild(this.debugRect);
        }
        this.sidesAmount = sidesAmount;
        // 
        this.sideLength = 300;
        this.faceRadius = -1;
        this.facesAmount = 12;
        this.facesColumns = 4;
        this.sides=3;
        this.isSingleNotch = isSingleNotch;
    }
    setForm(sides,length){
        //order matters
        this.setSides(sides);
        this.setLength(length);
    }
    setLength(lengthInPixels){
        // this.sideLength = to_mm(lengthInPixels);
        this.sideLength = lengthInPixels;
        const l = this.sideLength;
        const degreePerRadian = Math.PI / 180;
        const theta = this.theta;
        const radius = 0.5*l / Math.sin(theta * degreePerRadian*0.5);
        this.faceRadius=radius;
    }
    setSides(n){
        this.sidesAmount=n;
        const sides = this.sidesAmount;
        const theta = 360 / sides;
        this.theta = theta;

    }
    update(s,gap) {
        const sides = this.sidesAmount;
        this.singleFacesGroup.innerHTML = ""
        const facePath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        const gr   = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        const radius = this.faceRadius;
        if(this.isDebugging){
            const circle   = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
            this.singleFacesGroup.appendChild(circle);
            circle.setAttribute("fill","none")
            circle.setAttribute("stroke","black")
            circle.setAttribute("r",radius)
        }
        this.singleFacesGroup.appendChild(gr);
        gr.appendChild(facePath);
        // const l = to_mm(length);
        const notchD = this.notchD;//poorly created public variable
        const l = this.sideLength;
        // const dToVertex = to_mm(notchD );
        const dToVertex = notchD;
        // const g       = to_mm(gap)
        const g       = gap;
        const h0      = dToVertex;
        const gHalves = g   * 0.5;
        const h00     = h0  - gHalves;
        const h01     = h0  + gHalves;
        const h1      = l   - dToVertex;
        const h10     = h1  - gHalves;
        const h11     = h1  + gHalves;
        const midDist = h10 - h01;
        const endDist = l   - h11;
        // const depth   = to_mm(s);
        const depth   = s;
        facePath.setAttribute('stroke','red')
        facePath.setAttribute('stroke-width',1)
        facePath.setAttribute('fill','none');
        let modelPoints = [];
        if(this.isSingleNotch){
            modelPoints = [
                [0,0],
                [l*0.5-gHalves,0],
                [l*0.5-gHalves,depth],
                [l*0.5+gHalves,depth],
                [l*0.5+gHalves,0],
                [l,0]
            ]
        }else{
            modelPoints = [
                [0,0],
                [h00,0],
                [h00,depth],
                [h01,depth],
                [h01,0],
                [h10,0],
                [h10,depth],
                [h11,depth],
                [h11,0],
                [l,0]
            ]
        }
        const theta = this.theta;
        const degreePerRadian = Math.PI / 180;
        const outerAngleOffset = 90 + 0.5 * theta;
        let data = []
        for (let index = 0; index < sides; index++) {
            const angleDegree = theta * index //+ outerAngleOffset2;
            const angle       = angleDegree * degreePerRadian;
            const x           = Math.cos(angle) * radius;
            const y           = Math.sin(angle) * radius;
            const clonePoints = modelPoints
                .map(point => HingedPolyhedron.rotate2D(point,-angleDegree- outerAngleOffset))
                .map(point => [point[0]+x,point[1]+y])
            clonePoints.shift()
            data = [...data,...clonePoints]
        }
        this.data=data;
        const sidePathString = HingedPolyhedron.arrayToPath(data);
        facePath.setAttribute('d',sidePathString);
        return gr;
    }
    setNotch(value){
        this.notchD = value;
    }
    setPosition(x,y){
        this.singleFacesGroup.setAttribute('transform',`translate(${x},${y})`)
        // this.update()
    }
    notchPrecompute(s,gap){
        const a = Math.PI / this.sidesAmount;
        const minh = 2*s*Math.tan(a)// see notch-distance.svg at docs folder
        const gHalves = gap / 2;
        const actualMin = minh + gHalves;
        this.notchMin = actualMin;
        return actualMin
        contrlrNotchD.min(actualMin);
        contrlrNotchD.max(sideLength*0.5-gap);
        if(notchD-gHalves<minh){
            notchD=actualMin;
        }
        contrlrNotchD.updateDisplay();
    }
}