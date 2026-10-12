var e=document.querySelector(`[data-hero]`),t=document.querySelector(`[data-hero-canvas]`),n=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;n||document.querySelectorAll(`[data-glitch]`).forEach(e=>{let t=e.textContent??``,n=parseFloat(e.dataset.glitchIntensity??`0.8`),r=parseInt(e.dataset.glitchFrequency??`100`,10);setInterval(()=>{Math.random()>1-n*.05&&(e.textContent=t.split(``).map(e=>Math.random()>1-n*.2?`!@#$%^&*()_+-=[]{}|;:,.<>?`[Math.floor(Math.random()*26)]:e).join(``),setTimeout(()=>{e.textContent=t},50+Math.random()*100*n))},r)});var r=t?.getContext(`webgl`,{alpha:!1,antialias:!1});if(t&&r){let i={x:0,y:0};window.addEventListener(`mousemove`,e=>{i.x=(e.clientX/window.innerWidth-.5)*2,i.y=(e.clientY/window.innerHeight-.5)*2});function a(e,t){let n=r.createShader(e);return r.shaderSource(n,t),r.compileShader(n),r.getShaderParameter(n,r.COMPILE_STATUS)?n:(console.error(r.getShaderInfoLog(n)),null)}function o(e,t){let n=r.createProgram();return r.attachShader(n,a(r.VERTEX_SHADER,e)),r.attachShader(n,a(r.FRAGMENT_SHADER,t)),r.linkProgram(n),n}let s=o(`
      attribute vec2 aPos;
      varying vec2 vUv;
      void main() {
        vUv = aPos * 0.5 + 0.5;
        gl_Position = vec4(aPos, 0.0, 1.0);
      }
    `,`
      precision mediump float;
      uniform float uTime;
      uniform vec2 uMouse;
      uniform vec2 uResolution;
      uniform float uNoiseScale;
      varying vec2 vUv;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      float fbm(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 6; i++) {
          value += amplitude * noise(st);
          st *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      vec3 distortedNoise(vec2 uv) {
        vec2 st = uv * uNoiseScale;
        float time = uTime * 0.5;
        vec2 q = vec2(fbm(st + vec2(0.0, 0.0)),
                      fbm(st + vec2(5.2, 1.3)));
        vec2 r = vec2(fbm(st + 4.0 * q + vec2(1.7 - time * 0.15, 9.2)),
                      fbm(st + 4.0 * q + vec2(8.3 - time * 0.126, 2.8)));
        float f = fbm(st + r);

        float mouseDistance = length(uv - (uMouse * 0.5 + 0.5));
        float mouseEffect = 1.0 - smoothstep(0.0, 0.6, mouseDistance);

        float glitch = step(0.98, random(vec2(floor(uTime * 10.0), floor(uv.y * 50.0))));
        f += glitch * 0.3;

        vec3 color = vec3(0.0);
        color.r = f * f * f + 0.6 * f * f + 0.5 * f;
        color.g = f * f * f * f + 0.4 * f * f + 0.2 * f;
        color.b = f * f * f * f * f * f + 0.7 * f * f + 0.5 * f;

        float noiseTexture = random(uv * 100.0 + time);
        color += noiseTexture * 0.1;

        color += mouseEffect * vec3(0.3, 0.1, 0.2);

        float scanline = sin(uv.y * 800.0) * 0.04;
        color += scanline;

        return color;
      }

      void main() {
        vec2 uv = vUv;
        uv.x *= uResolution.x / uResolution.y;

        float aberration = 0.005;
        vec3 color;
        color.r = distortedNoise(uv + vec2(aberration, 0.0)).r;
        color.g = distortedNoise(uv).g;
        color.b = distortedNoise(uv - vec2(aberration, 0.0)).b;

        float grain = random(uv + uTime) * 0.1;
        color += grain;

        vec2 uvV = vUv;
        float vignette = 1.0 - length(uvV - 0.5) * 1.2;
        color *= vignette;

        color = pow(color, vec3(1.2));
        color *= 0.9;

        gl_FragColor = vec4(color, 1.0);
      }
    `),c=r.createBuffer();r.bindBuffer(r.ARRAY_BUFFER,c),r.bufferData(r.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),r.STATIC_DRAW);let l={aPos:r.getAttribLocation(s,`aPos`),uTime:r.getUniformLocation(s,`uTime`),uMouse:r.getUniformLocation(s,`uMouse`),uResolution:r.getUniformLocation(s,`uResolution`),uNoiseScale:r.getUniformLocation(s,`uNoiseScale`)},u=o(`
      attribute vec3 aPosition;
      attribute vec3 aColor;
      attribute float aSize;
      uniform float uDpr;
      varying vec3 vColor;
      void main() {
        vColor = aColor;
        gl_Position = vec4(aPosition, 1.0);
        gl_PointSize = aSize * uDpr;
      }
    `,`
      precision mediump float;
      varying vec3 vColor;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float alpha = smoothstep(0.5, 0.1, d) * 0.8;
        gl_FragColor = vec4(vColor, alpha);
      }
    `),d=new Float32Array(2400),f=new Float32Array(2400),p=new Float32Array(800);for(let e=0;e<800;e++){let t=e*3;d[t]=(Math.random()-.5)*2.4,d[t+1]=(Math.random()-.5)*2.4,d[t+2]=0;let n=Math.random();n<.33?(f[t]=.949,f[t+1]=.188,f[t+2]=.259):n<.66?(f[t]=1,f[t+1]=1,f[t+2]=1):(f[t]=0,f[t+1]=1,f[t+2]=1),p[e]=Math.random()*2.5+1}let m=r.createBuffer();r.bindBuffer(r.ARRAY_BUFFER,m),r.bufferData(r.ARRAY_BUFFER,d,r.DYNAMIC_DRAW);let h=r.createBuffer();r.bindBuffer(r.ARRAY_BUFFER,h),r.bufferData(r.ARRAY_BUFFER,f,r.STATIC_DRAW);let g=r.createBuffer();r.bindBuffer(r.ARRAY_BUFFER,g),r.bufferData(r.ARRAY_BUFFER,p,r.STATIC_DRAW);let _={aPosition:r.getAttribLocation(u,`aPosition`),aColor:r.getAttribLocation(u,`aColor`),aSize:r.getAttribLocation(u,`aSize`),uDpr:r.getUniformLocation(u,`uDpr`)};function v(){let e=Math.min(window.devicePixelRatio||1,2),{clientWidth:n,clientHeight:i}=t;t.width=Math.max(1,Math.floor(n*e)),t.height=Math.max(1,Math.floor(i*e)),r.viewport(0,0,t.width,t.height)}v(),window.addEventListener(`resize`,v);let y=!0,b=0,x=performance.now();function S(e){let a=(e-x)/1e3;r.useProgram(s),r.bindBuffer(r.ARRAY_BUFFER,c),r.enableVertexAttribArray(l.aPos),r.vertexAttribPointer(l.aPos,2,r.FLOAT,!1,0,0),r.uniform1f(l.uTime,a),r.uniform2f(l.uMouse,i.x,-i.y),r.uniform2f(l.uResolution,t.width,t.height),r.uniform1f(l.uNoiseScale,8),r.drawArrays(r.TRIANGLES,0,3);for(let e=0;e<800;e++){let t=e*3;d[t]+=(Math.random()-.5)*.004,d[t+1]+=(Math.random()-.5)*.004,d[t+1]+=Math.sin(a*3+e*.1)*6e-4,1/(1+Math.abs(d[t]-i.x)+Math.abs(d[t+1]+i.y))>.3&&(d[t]+=(Math.random()-.5)*.02,d[t+1]+=(Math.random()-.5)*.02),Math.abs(d[t])>1.2&&(d[t]*=-.8),Math.abs(d[t+1])>1.2&&(d[t+1]*=-.8)}r.useProgram(u),r.enable(r.BLEND),r.blendFunc(r.SRC_ALPHA,r.ONE),r.bindBuffer(r.ARRAY_BUFFER,m),r.bufferSubData(r.ARRAY_BUFFER,0,d),r.enableVertexAttribArray(_.aPosition),r.vertexAttribPointer(_.aPosition,3,r.FLOAT,!1,0,0),r.bindBuffer(r.ARRAY_BUFFER,h),r.enableVertexAttribArray(_.aColor),r.vertexAttribPointer(_.aColor,3,r.FLOAT,!1,0,0),r.bindBuffer(r.ARRAY_BUFFER,g),r.enableVertexAttribArray(_.aSize),r.vertexAttribPointer(_.aSize,1,r.FLOAT,!1,0,0),r.uniform1f(_.uDpr,Math.min(window.devicePixelRatio||1,2)),r.drawArrays(r.POINTS,0,800),r.disable(r.BLEND),!n&&y&&(b=requestAnimationFrame(S))}if(n)S(x+4200);else{let t=new IntersectionObserver(([e])=>{let t=y;y=e.isIntersecting,y&&!t?b=requestAnimationFrame(S):y||cancelAnimationFrame(b)});e&&t.observe(e),b=requestAnimationFrame(S)}}