class HingesManager {
    constructor({svg, guiFolder, dihedralAngles, facesSidesAmounts, hingesAmounts}) {
        this.hingesAmounts = hingesAmounts;
        this.edgesTypes = Object.keys(hingesAmounts);
        // console.log('hingesAmounts:---> ', hingesAmounts);
        const folder = guiFolder.addFolder('HingesManager');
        this.w = 100;//pixels
        // this.w = 15;//mm; hinge size
        this.margin=margin;
        this.dist = 3//mm
        this.columns = 4;
        folder.open()
        this.hinges=[];
        let i =0
        const posx = 200;
        for (const key in dihedralAngles) {
            if (dihedralAngles.hasOwnProperty(key)) {
                // console.log('key: ', key);
                const angle = dihedralAngles[key];
                const faceSidesAmount = facesSidesAmounts[i];
                const hinge = new Hinge(svg, folder, angle, faceSidesAmount, this.w, this.dist,posx*i)
                this.hinges.push(hinge)
            }
            i++
        }
        /*
        this.hinges = dihedralAngles.map((angle, i) => {
            // console.log('angle: ', angle);
            const faceSidesAmount = facesSidesAmounts[i];
            // const hingesAmount = hingesAmounts[i];
            const hinge = new Hinge(svg, folder, angle, faceSidesAmount, this.w, this.dist)
            return hinge
        });
        */
        // console.log('hinges: ', this.hinges);
        // folder.add(this, 'w', 10, 100).onChange(this.updateSize.bind(this))
        folder.add(this, 'w', 5, 20).name("hinge size, (w)[mm]").onChange(this.updateSize.bind(this))
        folder.add(this, 'dist', 2.5, 10).onChange(this.updateSize.bind(this))
        this.clones = document.createElementNS("http://www.w3.org/2000/svg",'g')
        // this.clones.setAttribute('transform','translate(800,0)')
        svg.appendChild(this.clones);
        // this.update()
        // this.doCloneHinges()
        this.updateSize()
    }
    updateSize() {
        this.hinges.forEach(hinge => {
            hinge.w = to_mm(this.w);
            hinge.dist = to_mm(this.dist);
        });
        this.update(this.s, this.g);
    }
    update(s, g) {
        var isAutoCloning;
        isAutoCloning = false;
        isAutoCloning = true;
        this.s = s;
        this.g = g;
        this.hinges.forEach(hinge => {
            hinge.update(s, g)
        });
        if (isAutoCloning) {
            this.doClearClones()
            this.doCloneHinges()
        } else {
            this.doClearClones()
        }
    }
    doCloneHinges(params) {
        // console.trace();
        let accumulatedH = 100;
        this.hinges.forEach((element, i) => {
            // console.log('i: ', i);
            const type = this.edgesTypes[i];
            // console.log('type: ', type);
            // console.log('element: ', element);
            const hingesAmount = this.hingesAmounts[type]
            // console.log('hingesAmount: ', hingesAmount);
            this.doCloneHinge(element,hingesAmount,accumulatedH);
            const bbox = this.clones.getBBox();
            accumulatedH+=bbox.height+20;
            // console.log('accumulatedH: ', accumulatedH);
        });
    }
    doClearClones() {
        this.clones.innerHTML = ""
    }
    doCloneHinge(hinge, cloneAmount) {
        const margin = this.margin;
        const columns = this.columns;
        var actualAmount = cloneAmount / 2 | 0;
        // console.log('actualAmount: ', actualAmount);
        const original = hinge.original;
        const bbox = original.getBBox();
        const cloneTx = bbox.width;
        const cloneTy = bbox.height;
        for (let index = 1; index < actualAmount; index++) {
            const qiece = original.cloneNode(true);
            this.clones.appendChild(qiece);
            const u = index % columns
            const v = index / columns | 0;
            // const x = u*(r+w+margin*0.5)+r+margin;
            const x = u * (cloneTx + margin) + margin;
            const y = v * (cloneTy + margin) + margin;
            const accumulatedHeight = y + h + 10;
            this.accumulatedHeight = accumulatedHeight; 
            qiece.setAttribute("transform", `translate(${x},${accumulatedHeight})`)
        }
    }
}