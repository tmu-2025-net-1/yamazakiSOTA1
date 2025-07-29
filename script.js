const { Engine, Runner, World, Bodies, Events, Body } = Matter;
const engine = Engine.create();
const world = engine.world;
world.gravity.y = -0.003; // 上向きに流れる感じ

const runner = Runner.create();
Runner.run(runner, engine);


// 1. 必要な要素をHTMLから取得
const sea = document.querySelector('.sea');           // 海のエリア
const input = document.getElementById('messageInput'); // 入力ボックス
const button = document.getElementById('flowButton');  // 流すボタン

const bgm = document.getElementById('bgm');           // BGM
const water = document.getElementById('water');       // 水の音

const modal = document.getElementById('soundModal'); // 音確認モーダル
const okb = document.getElementById('startSound'); // 音の確認ボタン

const tmodal = document.getElementById('tutorial'); // ty－とリアるモーダル
const tbutton = document.getElementById('closeTutorial'); // チュートリアル閉じるボタン
const startButton = document.getElementById('openTutorial'); // チュートリアル開始ボタン



function createLantern(text) {
  const startX = Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1;
  const startY = 230; // 画面下付近

  const el = document.createElement('div');//テキストコンテ
  el.className = 'floating-text';
  el.textContent = text[0];

  const ref = document.createElement('div');// 反射用の要素
  ref.className = 'reflection';
  ref.textContent = text[0];
  el.appendChild(ref);

  el.addEventListener('mouseenter', () => {
    const info = document.createElement('div'); // ホバー時の情報表示
    info.className = 'hover-info';
    info.textContent = text; // 入力されたテキストを表示
    el.appendChild(info);
  });
    el.addEventListener('mouseleave', () => {
    const info = el.querySelector('.hover-info');
    if (info) info.remove(); // ホバーを外したら情報を削除
    });


  

  // ぽちゃんアニメ用のクラスを付ける
  el.classList.add('splash-effect');
// アニメーションが終わったらクラスを外す
  el.addEventListener('animationend', () => {
  el.classList.remove('splash-effect');
  });


  const hon = document.createElement('div');// 本文用の要素
  hon.className = 'honbun';
  hon.textContent = text;


  const size = 150;
  el.style.fontSize = size + 'px';
  sea.appendChild(el);

  const body = Bodies.circle(startX, startY, size / 2, {
    restitution: 0.0001,
    frictionAir: 0.01
  });
  World.add(world, body);

  body.el = el;

  setTimeout(() => {
    World.remove(world, body);
    el.remove();
  }, 120000);
}


  button.addEventListener('click', () => {
  const text = input.value.trim();
  water.play(); // BGMを再生
  if (!text) return;
  createLantern(text);
  input.value = '';
});

okb.addEventListener('click', () => {
  bgm.play(); // BGMを再生
  modal.style.display = 'none'; // モーダルを閉じる
  tmodal.style.display = 'flex'; // チュートリアルを表示
});

tbutton.addEventListener('click', () => {
  tmodal.style.display = 'none'; // チュートリアルを閉じる
});

startButton.addEventListener('click', () => {
  tmodal.style.display = 'flex'; // チュートリアルを開く
});
  



Events.on(engine, 'afterUpdate', () => {

    const seaRect = sea.getBoundingClientRect();
    const seaHeight = seaRect.height;
    const seaTop = seaRect.top

    const time = Date.now() / 0.002; // 秒単位の時間

  for (let body of world.bodies) {
    if (body.el) {
      const x = body.position.x;
      const y = body.position.y;

      // 上に行くほど小さく
      const relativeY = 2 * y - seaTop/10;
      const t = 1 - (relativeY / seaHeight); // 下端0 → 上端1
      const scale = 1 - (t * t) * 0.37; // 上端で0.2倍まで小さく

      const swayY = Math.sin(time * 0.000005 + body.id) * 2; // 上下2px
      const rotation = Math.sin(time * 0.000003 + body.id) * 1; // 回転±5度


      body.el.style.transform =
        `translate(${x}px, ${y + swayY}px) scale(${scale}) rotate(${rotation}deg)`;

        if (scale < 0) {  // 例えば海の上端より上に行ったら消す
        World.remove(world, body);
        body.el.remove();
        }
    }
  }
});







