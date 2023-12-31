var file = document.getElementById('file');
var ok = document.getElementById('ok');
var tbodyFor = document.querySelector('#tableFor tbody');
var tableFor = document.querySelector('#tableFor');
var tableGr = document.querySelector('#tableGr');
var tbodyGr = document.querySelector('#tableGr tbody');
var divTable = document.querySelector('#divTable');
var divTables=document.querySelector('#divTables')
var container = document.querySelector('#container');
var divInput = document.querySelector('#divInput');
var searchFor = document.querySelector("#searchFor")
var btnfor = document.querySelector("#btnfor")
var btnGr = document.querySelector("#btnGr")
var divButton = document.querySelector("#divButton")
var slcfile;
var pliste=document.querySelector("#pliste")
var data;
let formateurs = []
let Groupe = []
file.addEventListener("change", function () {
    slcfile = file.files[0]
})
file.addEventListener("click", function () {
    this.value = ""
})
ok.addEventListener("click", function () {
    if (slcfile) {
        tbodyFor.innerHTML = ""
        let read = new FileReader()
        read.readAsBinaryString(slcfile)
        read.onload = (e) => {
            let result = e.target.result
            let workbook = XLSX.read(result, { type: "binary" })
            //  console.log(workbook);
            workbook.SheetNames.forEach(element => {
                data = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[element])
                // console.log(data[0]);
                slcFormateur()
                divTables.style.display = "block"
                divButton.style.display = "block"
                formateur()
            });
        }
    }
})
function slcFormateur() {
    data.map((ele) => {
        if (!formateurs.includes(ele["Formateur Affecté Présentiel Actif"])) {
            formateurs.push(ele["Formateur Affecté Présentiel Actif"])
        }
        if (!Groupe.includes(ele["Groupe"])) {
            Groupe.push(ele["Groupe"])
        }
    })
    // console.log(formateurs);
    // console.log(Groupe);
}
function formateur(nom = "") {
    formateurs.map(e => {
        if (e != "") {
            let code;
            let oneFormateur = data.filter(el => el["Formateur Affecté Présentiel Actif"] == e)
            let profex = oneFormateur[0]["Formateur Affecté Présentiel Actif"].includes(nom.toLocaleUpperCase())
            if (profex) {

                let totalAffecté = oneFormateur.reduce((previous, current) => {
                    let gr = []
                    if (!gr.includes(current["filière"])) {
                        let Présentiel = +current["MH Affectée Présentiel"]
                        let Sync = +current["MH Affectée Sync"]
                        gr.push(current["filière"])
                        code = current["Mle Affecté Présentiel Actif"]
                        return previous + Présentiel + Sync
                    }
                    else {
                        let Présentiel = +current["MH Affectée Présentiel"]
                        return previous + Présentiel
                    }

                }, 0)
                let totalRéalisée = oneFormateur.reduce((previous, current) => {
                    let gr = []
                    if (!gr.includes(current["filière"])) {
                        let Présentiel = +current["MH Réalisée Présentiel"]
                        let Sync = +current["MH Réalisée Sync"]
                        gr.push(current["filière"])
                        return previous + Présentiel + Sync
                    }
                    else {
                        let Présentiel = +current["MH Réalisée Présentiel"]
                        return previous + Présentiel
                    }
                }, 0)
                let pos = Math.floor((totalRéalisée * 100) / totalAffecté)
                // console.log(pos);

                let tr = document.createElement("tr")
                tr.innerHTML = `
        <td>${code}</td>
        <td>${e}</td>
        <td>${pos}%</td>
        `
        tr.addEventListener("click",function(){
            tbodyFor.innerHTML=""
            searchFor.value=e

            formateur(e)
        })
                tbodyFor.append(tr)
            }
        }
    })
}
function groupe(nom = "") {
    Groupe.map(e => {
        if (e != "") {
            let oneGroupe = data.filter(el => (el["Groupe"] ==e ))
            let profex = oneGroupe[0]["Groupe"].includes(nom.toLocaleUpperCase())
            
            if (profex) {

                let totalAffecté = oneGroupe.reduce((previous, current) => {
                    const mhAffectée = parseFloat(current["MH Affectée Globale (P & SYN)"]);
                    if (!isNaN(mhAffectée)) {
                        return previous + mhAffectée;
                    }
                    return previous;
                }, 0);
                
                let totalRéalisée = oneGroupe.reduce((previous, current) => {
                    const mhRéalisée = parseFloat(current["MH Réalisée Globale"]);
                    if (!isNaN(mhRéalisée)) {
                        return previous + mhRéalisée;
                    }
                    return previous;
                }, 0);
                
                let pos = Math.floor((totalRéalisée * 100) / totalAffecté)
                if(totalAffecté==0 && totalRéalisée==0){
                    pos=0
                }

                let tr = document.createElement("tr")
                tr.innerHTML = `
        <td>${e}</td>
        <td>${pos}%</td>
        `
        tr.addEventListener("click",function(){
            tbodyGr.innerHTML=""
            searchFor.value=e

            groupe(e)
        })
                tbodyGr.append(tr)
            }
        }
    })
}


searchFor.addEventListener("input", function () {
    tbodyFor.innerHTML = ""
    tbodyGr.innerHTML = ""
    formateur(this.value)
    groupe(this.value)
})
btnGr.addEventListener("click", function () {
    searchFor.value=""
    groupe(searchFor.value)
    tbodyFor.innerHTML = ""
    tableFor.style.display = "none"
    tableGr.style.display = "inline-table"
    btnGr.classList.remove("btn-secondary")
    btnGr.classList.add("btn-success")
    btnfor.classList.add("btn-secondary")
    btnfor.classList.remove("btn-success")
    pliste.innerHTML="liste de groupe"
    
})
btnfor.addEventListener("click", function () {
    searchFor.value=""
    formateur(searchFor.value)
    pliste.innerHTML="liste de formateur"
    tbodyGr.innerHTML = ""
    tableGr.style.display = "none"
    tableFor.style.display = "inline-table"
    btnfor.classList.remove("btn-secondary")
    btnfor.classList.add("btn-success")
    btnGr.classList.add("btn-secondary")
    btnGr.classList.remove("btn-success")
})
// pdf 
window.onload = function () {
    document.getElementById("download")
        .addEventListener("click", () => {
            var copyTable = divTable.cloneNode(true)
            copyTable.id="divTableCopy"
            var elm = document.createElement("div")
            elm.innerHTML = `
            <style>
            #headBar{
                max-width: 95%;
                margin: 1px auto 50px;
                display: flex;
                align-items: center;
                text-align: center;
            }
            #headBar p{
                width: 90%;
                text-align: center;
                font-size: 20px ;
                font-family: 'Courier New', Courier, monospace;
                font-weight: bold;
            }
            #headBar img{
                width: 80px;
                height: 80px;
            }
 
          
            #divTableCopy table{
                border:0.1px solid black;
                border-left:0;
                border-right:0;
                text-align:center

            }
            #divTableCopy tr:nth-of-type(even){
                background:#e7e7e769;
            }
            #divTableCopy thead tr:nth-of-type(odd){
                background:#d5d5d5;
            }
            </style>
            `
            elm.innerHTML += `
            <div id="headBar">
        <img src="Logo_ofppt.png" alt="404">
        <p>Iinstitut Specialise de Technologie Applique Berkane</p>
    </div>
    `

            elm.append(copyTable)
            var opt = {
                margin: 1,
                filename: 'myliste.pdf',
                image: { type: 'jpeg', quality: 1 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
            html2pdf().from(elm).set(opt).save();
        })
}
//
