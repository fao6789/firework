const WIDTH = 1400;
const HEIGHT = 800;
const PARTICALE_SIZE = 7;
const PARTICALE_CHANGE_SIZE_SPEED = 0.05;
const PARTICALE_CHANGE_SPEED = 0.5;
const ACCELERATION = 0.12;
const DOT_CHANGE_SIZE = 0.1;
const DOT_CHANGE_OPACITY = 0.07;
const PARTICLA_MIN_SPEED = 10;
const NUMBER_PARTICLE = 25;

class particle {
    //deg góc bay ra của hạt
    constructor(bullet, deg) {
        this.bullet = bullet;
        this.ctx = bullet.ctx;
        this.deg = deg;
        this.x = this.bullet.x;
        this.y = this.bullet.y;
        this.color = this.bullet.color;
        this.size = PARTICALE_SIZE;
        this.speed = Math.random() *4 + PARTICLA_MIN_SPEED;
        this.speedX = 0;
        this.speedY = 0;
        this.fallSpeed = 0;
        this.dots = [
            // { x: 10, y: 10, alpha: 1, size: 10 }
        ];
    };

    update() {

        this.speed -= PARTICALE_CHANGE_SPEED;
        // điều này làm viên không đi ngược lại
        if (this.speed < 0) {
            this.speed = 0;
        }
        // increase fail speed 
        this.fallSpeed += ACCELERATION;
        this.speedX = this.speed * Math.cos(this.deg);
        this.speedY = this.speed * Math.sin(this.deg)+ this.fallSpeed;

        // calculate position
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > PARTICALE_CHANGE_SIZE_SPEED) {
            this.size -= PARTICALE_CHANGE_SIZE_SPEED;
        }
        if (this.size > 0) {
            this.dots.push({
                x: this.x,
                y: this.y,
                opacity: 1,
                size: this.size,
            });
        }

        this.dots.forEach(dot => {
            dot.size -= DOT_CHANGE_SIZE;
            dot.opacity -= DOT_CHANGE_OPACITY;
        });
        this.dots = this.dots.filter(dot => {
            return dot.size > 0; 
        });
        if (this.dots.length == 0) {
            this.remove();  
        };
    }
    remove() {
        this.bullet.particles.splice(this.bullet.particles.indexOf(this), 1);
    }
    draw() {
        this.dots.forEach(dot => {
            this.ctx.fillStyle = 'rgba('+this.color+','+dot.opacity+')';
            this.ctx.beginPath();
            this.ctx.arc(dot.x, dot.y, dot.size, 0, 2 * Math.PI);
            this.ctx.fill();
        });  
    }
}
class bullet {
    constructor(fireworks) {
        this.fireworks = fireworks;
        this.ctx = fireworks.ctx;
        this.x = Math.random() * WIDTH;
        this.y = Math.random() * HEIGHT/2;
        this.color = Math.floor(Math.random() * 255) + ',' +
            Math.floor(Math.random() * 255) + ',' +
            Math.floor(Math.random() * 255);
        this.particles = [];

        // create one particle
        let bulletDeg = Math.PI * 2 / NUMBER_PARTICLE;

        for (let i = 0; i < NUMBER_PARTICLE; i++) {
            let newPartice = new particle(this, i * bulletDeg);
            this.particles.push(newPartice);
        }


    }
    remove() {
        this.fireworks.bullets.splice(this.fireworks.bullets.indexOf(this), 1);
    }
    update() {
        if (this.particles.length == 0) {
            this.remove();
        }
        this.particles.forEach(particle => particle.update());

    }
    draw() {
        this.particles.forEach(particle => particle.draw());
    }

}
class fireworks {
    constructor() {
        // gọi id của thẻ
        this.canvas = document.createElement('canvas');
        //sở hữu nhiều hàm dành cho vẽ hình ảnh như hình hộp, hình tròn, chữ,… và phải là '2d'
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = WIDTH;
        this.canvas.height = HEIGHT;
        document.body.appendChild(this.canvas);

        this.bullets = [];
        // create new bullet
        setInterval(() => {
            let newBullet = new bullet(this);
            this.bullets.push(newBullet);
            this.loop();
        },500);
       
    }

    loop() {
        //vòng lặp vẽ hình
        this.bullets.forEach(bullet => bullet.update());
        this.draw();
        setTimeout(() => this.loop(), 20);
    }

    clearScreen() {
        this.ctx.fillStyle = '#000000';
        // fill hình chữ nhật
        // (py, px, w ,h)
        this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }

    draw() {
        // xóa màn hình
        this.clearScreen();
        this.bullets.forEach(bullet => bullet.draw());
    }
}

var f = new fireworks();