//----- VARIÁVEIS -----
var canvas = document.querySelector('#canvas')
var ctx = canvas.getContext('2d')
var btnMenu = document.querySelector('.botao__voltar-menu')

var velocidadeX = 1
var velocidadeY = 0
var cobraX = 0
var cobraY = 0
var cabecaCobra = {cobraX, cobraY}
var tamanhoCobra = [{x: cobraX, y: cobraY}]
var totalCobra = 1

var pontuacoes = []
var quantMaca = 0
var pontuacaoAtual = document.querySelector('.pontuacao')
var melhorPontuacao = document.querySelector('.melhor-pontuacao')
var maior = 0
var maiorJSON = localStorage.getItem('Melhor pontuação')

if (maiorJSON === null) {
    maiorJSON = 0
}

maior = JSON.parse(maiorJSON)
melhorPontuacao.innerHTML = `<p class="melhor-pontuacao">Melhor pontuação: ${maior}</p>`

var cobra = new Cobra(18, 18, "#059212", cobraX, cobraY)
var maca = new Maca(18, 18, "#AC0C0C")

setInterval(andarCobra, 10)
document.addEventListener('keydown', evento => escolherDirecao(evento))
btnMenu.addEventListener('click', () => {
    window.location.href = 'index.html'
})

// ----- FUNÇÕES -----
function gerarCoordenadaAleatoria() { //Cria uma coordenada aleatória para a maçã
    return Math.floor(Math.random() * 485 + 1)
}

function Cobra(largura, altura, cor, x, y) {
    this.largura = largura
    this.altura = altura
    this.cor = cor
    this.x = x
    this.y = y

    this.desenha = () => {
        ctx.fillStyle = cobra.cor
        for (let i = 0; i < tamanhoCobra.length; i++) {
            ctx.fillRect(tamanhoCobra[i].x, tamanhoCobra[i].y, cobra.largura, cobra.altura)
        }
    }

    this.morre = () => {
        for (let i = 1; i < tamanhoCobra.length; i++) {
            if (tamanhoCobra[0].x === tamanhoCobra[i].x && tamanhoCobra[0].y === tamanhoCobra[i].y) {
                window.location.reload()
            }
        }
    }
}

function Maca(largura, altura, cor) {
    this.largura = largura
    this.altura = altura
    this.cor = cor
    this.macaX = gerarCoordenadaAleatoria()
    this.macaY = gerarCoordenadaAleatoria()

    this.desenha = () => {
        ctx.fillStyle = this.cor
        ctx.fillRect(this.macaX, this.macaY, largura, altura)
    }

    this.desaparece = (x, y) => {
        ctx.clearRect(x, y, canvas.width, canvas.height)
        ctx.fillStyle = 'white'
        ctx.fillRect(x, y, largura, altura)
    }

    this.novaCoordenada = () => {
        this.macaX = gerarCoordenadaAleatoria()
        this.macaY = gerarCoordenadaAleatoria()
    }
}

function andarCobra() {
    cobraX += velocidadeX
    cobraY += velocidadeY

    cabecaCobra.cobraX = cobraX
    cabecaCobra.cobraY = cobraY

    comerMaca()

    if (tamanhoCobra.length === totalCobra) {
        tamanhoCobra.shift();
    }
    if (tamanhoCobra.length < totalCobra) {
        tamanhoCobra.push({x: cobraX, y: cobraY});
    }

    if (cobraX > 485 || cobraX < 0) { //Caso a cobra saia da delimitação do jogo, a página é recarregada
        window.location.reload()
    }
    if (cobraY > 485 || cobraY < 0) {
        window.location.reload()
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    cobra.desenha()
    maca.desenha()
    cobra.morre()

    let maiorPontuacao = pontuacaoMelhor(pontuacoes, maior)
    //localStorage.removeItem('Melhor pontuação')
    localStorage.setItem('Melhor pontuação', JSON.stringify(maiorPontuacao))
}

function direcao(dx, dy) {
    if (velocidadeX === dx) { //Verificações que evitam a cobra "voltar" na mesma direção
        return
    }
    if (velocidadeY === dy) {
        return
    }
    velocidadeX = dx
    velocidadeY = dy
}

function escolherDirecao(evento) {
    let tecla = evento.key
    if (tecla === 'ArrowLeft') {
        direcao(-1, 0)
    }
    if (tecla === 'ArrowRight') {
        direcao(1, 0)
    }
    if (tecla === 'ArrowUp') {
        direcao(0, -1)
    }
    if (tecla === 'ArrowDown') {
        direcao(0, 1)
    }
}

function comerMaca() {
    if (verificarPosicaoMaca()) {
        maca.desaparece(maca.macaX, maca.macaY)
        maca.novaCoordenada()
        maca.desenha()
        quantMaca += 1
        pontuacaoAtual.innerHTML = `<p class="pontuacao">Pontuação atual: ${quantMaca}</p>`
        pontuacoes.push(quantMaca)
        totalCobra += 12
    }
}

function pontuacaoMelhor(pontuacoes, maior) {
    for (let i = 0; i < pontuacoes.length; i++) {
        if (pontuacoes[i] > maior) {
            maior = pontuacoes[i]
        }
    }
    return maior
}

// Para que a cobra consiga comer sem que ela e a maçã estajam exatamente na mesma posição
function verificarPosicaoMaca() {
    if ((cabecaCobra.cobraX + cobra.largura) < (maca.macaX) || (cabecaCobra.cobraX) > (maca.macaX + maca.largura))
        return false;

    if ((cabecaCobra.cobraY + cobra.altura) < maca.macaY || (cabecaCobra.cobraY) > (maca.macaY + maca.altura))
        return false;

    return true;
}
