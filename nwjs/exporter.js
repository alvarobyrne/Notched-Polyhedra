const ISNW=typeof nw !== 'undefined';
if(ISNW){

    var fs = require('fs');
    var path = require('path');
    var CWD = process.cwd();
    const svgExportPath = 'tmp/dihedral.svg';
    var tmpSVGPath = path.join(CWD, svgExportPath);
    var shell = nw.Shell;
    function pre_exportSVG() {
        // svg.appendChild(singleFacesGroup);
        // svg.appendChild(facesGroup);
        let svg = document.querySelector("#bins svg");
        if(!svg)
        svg = document.querySelector("#svg");
        svg.removeAttribute("width")
        svg.removeAttribute("height")
        var outerHTML = svg.outerHTML
        
        fs.writeFileSync(svgExportPath,outerHTML,'utf8')
        
        // svgFaces.appendChild(singleFacesGroup);
        // svgFaces.appendChild(facesGroup);
    }
    function exportSVG() {
        pre_exportSVG();
        shell.openItem(tmpSVGPath);
    }
}