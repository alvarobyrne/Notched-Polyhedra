const ISNW=typeof nw !== 'undefined';
let fs, tmpSVGPath;
if(ISNW){

    fs = require('fs');
    const path = require('path');
    const CWD = process.cwd();
    const svgExportPath = 'tmp/dihedral.svg';
    tmpSVGPath = path.join(CWD, svgExportPath);
    var shell = nw.Shell;
    function exportSVG() {
        // svg.appendChild(singleFacesGroup);
        // svg.appendChild(facesGroup);
        var outerHTML = svg.outerHTML
        
        fs.writeFileSync(svgExportPath,outerHTML,'utf8')
        
        shell.openItem(tmpSVGPath);
        // svgFaces.appendChild(singleFacesGroup);
        // svgFaces.appendChild(facesGroup);
    }
}