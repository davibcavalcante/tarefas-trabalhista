const jsonState = () => {
    let json;

    const getJson = () => {
        return json;
    }

    const setJson = (newJson) => {
        json = newJson;
    }

    return { getJson, setJson };
}

const jsonStateManager = jsonState();

const formatCnpj = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 14) value = value.slice(0, 14);

    value = value.replace(/^(\d{2})(\d)/, '$1.$2');
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');

    e.target.value = value;
};

const blockInputs = (e) => {
    const id = e.target.id.split('-')[0];

    const block = (ignore = []) => {
        const arrSelect = document.querySelectorAll('select');

        arrSelect.forEach((sel) => {
            const selIdBase = sel.id.split('-')[0];
            if (!sel.id.includes(id) && !ignore.includes(selIdBase)) {
                sel.disabled = true;
                sel.value = '';
            } else {
                sel.disabled = false;
            }
        });
    };

    const unlock = (check = false) => {
        let isOk = true;
        const arrSelect = document.querySelectorAll('select');

        if (check) {
            arrSelect.forEach((sel) => {
                if (sel.id !== 'colab-select' && sel.value !== '') {
                    isOk = false;
                }
            });
        }

        if (isOk) {
            arrSelect.forEach((sel) => {
                sel.disabled = false;
            });
        }
    };

    switch (id) {
        case 'colab': 
            if (e.target.value === 'nao') {
                block();
            } else {
                unlock(true);
            }
            break;

        case 'dom':
            if (e.target.value === 'sim') {
                block(['colab']);
            } else {
                unlock();
            }
            break;

        case 'faz':
            if (e.target.value === 'sim') {
                block(['colab', 'fun', 'prin', 'trib']);
            } else {
                unlock();
            }
            break;

        case 'mtz':
            if (e.target.value === 'sim') {
                block(['colab', 'folha', 'mfun', 'trib']);
            } else {
                unlock();
            }
            break;

        case 'fl':
            if (e.target.value === 'sim') {
                block(['colab', 'mint', 'flfolha', 'trib']);
            } else {
                unlock();
            }
            break;

        case 'folha':
            const mFunSel = document.querySelector('#mfun-select');
            if (e.target.value === 'sim') {
                mFunSel.value = 'nao';
                mFunSel.disabled = true;
            } else if (e.target.value === 'nao') {
                mFunSel.disabled = false;
            } else {
                mFunSel.value = '';
                mFunSel.disabled = false;
            }
            break;

        case 'mfun':
            const mFolSel = document.querySelector('#folha-select');
            if (e.target.value === 'sim') {
                mFolSel.value = 'nao';
                mFolSel.disabled = true;
            } else if (e.target.value === 'nao') {
                mFolSel.disabled = false;
            } else {
                mFolSel.value = '';
                mFolSel.disabled = false;
            }
            break;

        case 'mint':
            const flFolSel = document.querySelector('#flfolha-select');
            if (e.target.value === 'sim') {
                flFolSel.value = 'nao';
                flFolSel.disabled = true;
            } else if (e.target.value === 'nao') {
                flFolSel.value = 'sim';
            } else {
                flFolSel.value = '';
                flFolSel.disabled = false;
            }
            break;

        case 'flfolha':
            const mintSel = document.querySelector('#mint-select');
            if (e.target.value === 'sim') {
                mintSel.value = 'nao';
                mintSel.disabled = true;
            } else if (e.target.value === 'nao') {
                mintSel.value = 'sim';
            } else {
                mintSel.value = '';
                mintSel.disabled = false;
            }
            break;
    };
};

const createSheet = async () => {
    try {
        const activeJson = jsonStateManager.getJson();
        
        const newSheet = XLSX.utils.json_to_sheet(activeJson);
        const newWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(newWorkbook, newSheet, "Tarefas - DP");

        const excelBuffer = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = 'planilha_modificada.xlsx';
        link.click();

        alert('Planilha baixada com sucesso!');
    } catch (error) {
        console.log(error)
    }
};

const createJSON = (tasks, cnpj) => {
    let json = [];

    tasks.forEach((task) => {
        json.push({
            "CNPF, CPF ou Código do Cliente": cnpj, 
            "Área": "Trabalhista", 
            "Tarefa": task,
            "Ínicio (Dia do mês)": "",
            "Prazo (Dia do mês)": "",
            "Prazo (Dia fixo final do mês)": "",
            "Considerar dia útil (Sim / Não)": "",
            "Inicio Mês Subsequente (Caso não, deixe em branco)": "",
            "Prazo Mês Subsequente (Caso não, deixe em branco)": "",
            "Marcar todas tarefas pelo regime do cliente (Sim / Não)": "",
            "Marcar tarefas iguais do cliente (CNPJ, CPF ou Código do Cliente)": "",
            "Desmarcar tarefa? (Sim ou deixe em branco)": ""
        });
    });

    jsonStateManager.setJson(json);
};

const setJSON = (id, cnpj) => {
    const tributSel = document.querySelector('#trib-select');
    switch (id) {
        case 0: 
            jsonStateManager.setJson([
            {
                "CNPF, CPF ou Código do Cliente": cnpj, 
                "Área": "Trabalhista", 
                "Tarefa": "DCTFWEB SEM MOVIMENTO",
                "Ínicio (Dia do mês)": "",
                "Prazo (Dia do mês)": "",
                "Prazo (Dia fixo final do mês)": "",
                "Considerar dia útil (Sim / Não)": "",
                "Inicio Mês Subsequente (Caso não, deixe em branco)": "",
                "Prazo Mês Subsequente (Caso não, deixe em branco)": "",
                "Marcar todas tarefas pelo regime do cliente (Sim / Não)": "",
                "Marcar tarefas iguais do cliente (CNPJ, CPF ou Código do Cliente)": "",
                "Desmarcar tarefa? (Sim ou deixe em branco)": ""
            }
            ]);
            break;
        
        case 1:
            const tasksDomesticas = [
                'PUBLICAR RECIBO 13º SALARIO - DM', 
                'PUBLICAR RECIBO ADIANTAMENTO 13º SALARIO DM',
                'PUBLICAR FOLHA DE PAGAMENTO DM'
            ]

            createJSON(tasksDomesticas, cnpj);
            break;

        case 2:
            const tasksFzNormal = [
                'PUBLICAR FOLHA DE PAGAMENTO e-SOCIAL - FAZENDA PRINCIPAL', 
                'PUBLICAR RECIBO 13º SALARIO - e-SOCIAL/DCTF web',
                'PUBLICAR RECIBO 13º SALARIO',
                'PUBLICAR RECIBO ADIANTAMENTO 13º SALARIO'
            ]
            
            createJSON(tasksFzNormal, cnpj);
            break;

        case 3:
            const tasksFzFunrural = [
                'PUBLICAR FOLHA DE PAGAMENTO e-SOCIAL - FUNRURAL - FAZENDA PRINCIPAL - FUNRURAL', 
                'PUBLICAR RECIBO 13º SALARIO',
                'PUBLICAR RECIBO ADIANTAMENTO 13º SALARIO'
            ]
            
            createJSON(tasksFzFunrural, cnpj);
            break;
        
        case 4:
            const tasksDemaisFzNormal = [
                'PUBLICAR FOLHA DE PAGAMENTO e-SOCIAL - DEMAIS FAZENDAS', 
                'PUBLICAR RECIBO 13º SALARIO - e-SOCIAL/DCTF web FILIAL',
                'PUBLICAR RECIBO 13º SALARIO',
                'PUBLICAR RECIBO ADIANTAMENTO 13º SALARIO'
            ]
            
            createJSON(tasksDemaisFzNormal, cnpj);
            break;

        case 5:
            const tasksDemaisFzFunrural = [
                'PUBLICAR FOLHA DE PAGAMENTO e-SOCIAL - DEMAIS FAZENDAS - FUNRURAL', 
                'PUBLICAR RECIBO 13º SALARIO',
                'PUBLICAR RECIBO ADIANTAMENTO 13º SALARIO'
            ]
            
            createJSON(tasksDemaisFzFunrural, cnpj);
            break;

        case 6:
            const tasksFlInterna = [
                'PUBLICAR FOLHA DE PAGAMENTO e-SOCIAL - FILIAL (mtz interna)', 
                'PUBLICAR RECIBO 13º SALARIO',
                'PUBLICAR RECIBO ADIANTAMENTO 13º SALARIO'
            ]

            if (tributSel.value === 'outros') {
                tasksFlInterna.push('ATUALIZACAO FAP');
            }
            
            createJSON(tasksFlInterna, cnpj);
            break;
        
        case 7: 
            const tasksFlFolhaExterna = [
                'PUBLICAR FOLHA DE PAGAMENTO E-SOCIAL - FILIAL SOMENTE FOLHA/MTZ EXTERNA', 
                'PUBLICAR RECIBO 13º SALARIO',
                'PUBLICAR RECIBO ADIANTAMENTO 13º SALARIO'
            ]

            if (tributSel.value === 'outros') {
                tasksFlFolhaExterna.push('ATUALIZACAO FAP');
            }
            
            createJSON(tasksFlFolhaExterna, cnpj);
            break;

        case 8:
            const tasksMtz = [
                'PUBLICAR FOLHA DE PAGAMENTO E-SOCIAL - MTZ', 
                'PUBLICAR RECIBO 13º SALARIO',
                'PUBLICAR RECIBO ADIANTAMENTO 13º SALARIO'
            ]

            if (tributSel.value === 'outros') {
                tasksMtz.push('ATUALIZACAO FAP');
            }
            
            createJSON(tasksMtz, cnpj);
            break;

        case 9:
            const tasksMtzFolha = [
                'PUBLICAR FOLHA DE PAGAMENTO e-SOCIAL/DCTF-web - DP MTZ (somente folha)', 
                'PUBLICAR RECIBO 13º SALARIO',
                'PUBLICAR RECIBO ADIANTAMENTO 13º SALARIO'
            ]

            console.log(tributSel.value)
            if (tributSel.value === 'outros') {
                tasksMtzFolha.push('ATUALIZACAO FAP');
            }
            console.log(tasksMtzFolha)
            
            createJSON(tasksMtzFolha, cnpj);
            break;

        case 10:
            const tasksMtzFunrural = [
                'PUBLICAR FOLHA DE PAGAMENTO E-SOCIAL - MTZ FUNRURAL', 
                'PUBLICAR RECIBO 13º SALARIO',
                'PUBLICAR RECIBO ADIANTAMENTO 13º SALARIO'
            ]

            if (tributSel.value === 'outros') {
                tasksMtzFunrural.push('ATUALIZACAO FAP');
            }
            
            createJSON(tasksMtzFunrural, cnpj);
            break;
    }
};

const checkType = (cnpj) => {
    const domSel = document.querySelector('#dom-select');

    const fazSel = document.querySelector('#faz-select');
    const funSel = document.querySelector('#fun-select');
    const prinSel = document.querySelector('#prin-select');

    const flSel = document.querySelector('#fl-select');
    const mIntSel = document.querySelector('#mint-select');
    const flFolhaSel = document.querySelector('#flfolha-select');

    const mtzSel = document.querySelector('#mtz-select');
    const folhaSel = document.querySelector('#folha-select');
    const mFunSel = document.querySelector('#mfun-select');

    if (domSel.value === 'sim') {
        setJSON(1, cnpj);
        return createSheet();
    }

    if (fazSel.value === 'sim' && funSel.value === 'nao' && prinSel.value === 'sim') {
        setJSON(2, cnpj);
        return createSheet();
    } else if (fazSel.value === 'sim' && funSel.value === 'sim' && prinSel.value === 'sim') {
        setJSON(3, cnpj);
        return createSheet();
    } else if (fazSel.value === 'sim' && funSel.value === 'nao' && prinSel.value === 'nao') {
        setJSON(4, cnpj);
        return createSheet();
    } else if (fazSel.value === 'sim' && funSel.value === 'sim' && prinSel.value === 'nao') {
        setJSON(5, cnpj);
        return createSheet();
    }

    if (flSel.value === 'sim' && mIntSel.value === 'sim' && flFolhaSel === 'nao') {
        setJSON(6, cnpj);
        return createSheet();
    } else if (flSel.value === 'sim' && mIntSel.value === 'nao' && flFolhaSel === 'sim') {
        setJSON(7, cnpj);
        return createSheet();
    }

    if (mtzSel.value === 'sim' && folhaSel.value === 'nao' && mFunSel.value === 'nao') {
        setJSON(8, cnpj);
        return createSheet();
    } else if (mtzSel.value === 'sim' && folhaSel.value === 'sim' && mFunSel.value === 'nao') {
        setJSON(9, cnpj);
        return createSheet();
    } else if (mtzSel.value === 'sim' && folhaSel.value === 'nao' && mFunSel.value === 'sim') {
        setJSON(10, cnpj);
        return createSheet();
    }
};

const getTasks = (e) => {
    e.preventDefault();

    const fazSel = document.querySelector('#faz-select');
    const flSel = document.querySelector('#fl-select');
    const mtzSel = document.querySelector('#mtz-select');

    const fls = document.querySelectorAll('.fls-select');
    const mtzs = document.querySelectorAll('.mtzs-select');
    const fazs = document.querySelectorAll('.fazs-select');

    const tributSel = document.querySelector('#trib-select');

    const elCnpj = document.querySelector('#cnpj-input');
    if (elCnpj.value.length !== 18) {
        alert('CNPJ inválido!')
        return;
    }

    const colSel = document.querySelector('#colab-select');

    const checkEmpty = (sels) => {
        let status = true;
        sels.forEach((sel) => {
            if (sel.value === '') {
                status = false;
            }
        });

        return status;
    }

    if (colSel.value === '') {
        alert('Preencha o campo de colaboradores!');
    } else if (colSel.value === 'sim') {
        if (tributSel.value === '') return alert('Preencha o campo de tributação.');

        let ok = true;

        if (fazSel.value !== '') {
            ok = checkEmpty(fazs);
        }

        if (flSel.value !== '') {
            ok = checkEmpty(fls);
        }

        if (mtzSel.value !== '') {
            ok = checkEmpty(mtzs);
        }


        if (ok) return checkType(elCnpj.value);

        alert('Preencha corretamente os campos.')
    } else {
        setJSON(0, elCnpj.value);
        createSheet();
    }
};

const setEvents = () => {
    const cnpjInput = document.querySelector("#cnpj-input");
    cnpjInput.addEventListener('input', formatCnpj);

    const selects = document.querySelectorAll('select');
    selects.forEach((sel) => {
        sel.addEventListener('change', blockInputs);
    });

    const form = document.querySelector('#form');
    form.addEventListener('submit', getTasks);
};

window.addEventListener('DOMContentLoaded', setEvents);