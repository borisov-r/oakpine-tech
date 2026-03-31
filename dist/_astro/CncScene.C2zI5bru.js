import"./disclose-version.DsnmJJEf.js";import{o as qt,q as Qt,p as pt,u as xn,c as bn,f as ie,v as wn,a as G,h as vt,w as Dn,s as y,g as v,j as we,d as V,i as X,x as J,t as lt,e as H,r as N}from"./template.DtZfKPYR.js";import{d as Mn,a as pe,s as be}from"./render.BTq1sVAA.js";import{i as dt}from"./if.Bnb4x8QM.js";import{e as Sn,i as Pn}from"./each.DbAPb_14.js";import{s as Be}from"./class.3jyHBqXt.js";import{d as En,w as Ut,p as Ve,s as On,a as Cn,b as Tn,r as An}from"./props.LCskouTu.js";import{p as Ht,u as In,c as me,D as Fe,V as I,S as mt,M as je,R as _t,O as jn,a as oe,B as Ke,U as $e,b as Ln,d as Nn,e as Ze,L as kn,C as zn,f as Ie,T as Te,Q as Yt,g as Ft,P as Rn,h as Un,i as Hn,j as Jt,k as en,l as Yn,m as b,n as tn,o as ge,w as nn,q as Fn,r as Zn,s as Bn,t as Xn,v as Gn,F as Zt,x as Wn,y as w,z as Vn,A as $n}from"./T.-shqGUd5.js";import{s as Kn}from"./snippet.2QqtCTMV.js";import"./branches.CNLIHHx7.js";function qn(t,e){e&&qt(Ht,{...Qt(Ht),[t]:e})}function Qn(t,e,n){const i=In();if(!i)throw new Error("No user context store found, did you invoke this function outside of your main <Canvas> component?");return e?(i.update(o=>{if(t in o)return o;const r=typeof e=="function"?e():e;return o[t]=r,o}),i.current[t]):En(i,o=>o[t])}const Pe=t=>({subscribe:t.subscribe,get current(){return t.current}});let Re=0;const yt=me(!1),qe=me(!1),gt=me(void 0),xt=me(0),bt=me(0),on=me([]),wt=me(0),{onStart:Jn,onLoad:ei,onError:ti}=Fe;Fe.onStart=(t,e,n)=>{Jn?.(t,e,n),qe.set(!0),gt.set(t),xt.set(e),bt.set(n);const i=(e-Re)/(n-Re);wt.set(i),i===1&&yt.set(!0)};Fe.onLoad=()=>{ei?.(),qe.set(!1)};Fe.onError=t=>{ti?.(t),on.update(e=>[...e,t])};Fe.onProgress=(t,e,n)=>{e===n&&(Re=n),qe.set(!0),gt.set(t),xt.set(e),bt.set(n);const i=(e-Re)/(n-Re)||1;wt.set(i),i===1&&yt.set(!0)};Pe(qe),Pe(gt),Pe(xt),Pe(bt),Pe(on),Pe(wt),Pe(yt);new I;new I;new I;new mt;new je;new _t;new I;new I;new je;new I;new I;new jn;new I;new I;new I;new oe;const ni="Right",ii="Top",oi="Front",ri="Left",ai="Bottom",si="Back";[ni,ii,oi,ri,ai,si].map(t=>t.toLocaleLowerCase());new Ke;new I;$e.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new oe(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};Ln.line={uniforms:Nn.merge([$e.common,$e.fog,$e.line]),vertexShader:`
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		void trimSegment( const in vec4 start, inout vec4 end ) {

			// trim end segment so it terminates between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
			float nearEstimate = - 0.5 * b / a;

			float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

			end.xyz = mix( start.xyz, end.xyz, alpha );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
				vUv = uv;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					trimSegment( start, end );

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					trimSegment( end, start );

				}

			}

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 tmpFwd = normalize( mix( start.xyz, end.xyz, 0.5 ) );
				vec3 worldUp = normalize( cross( worldDir, tmpFwd ) );
				vec3 worldFwd = cross( worldDir, worldUp );
				worldPos = position.y < 0.5 ? start: end;

				// height offset
				float hw = linewidth * 0.5;
				worldPos.xyz += position.x < 0.0 ? hw * worldUp : - hw * worldUp;

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// cap extension
					worldPos.xyz += position.y < 0.5 ? - hw * worldDir : hw * worldDir;

					// add width to the box
					worldPos.xyz += worldFwd * hw;

					// endcaps
					if ( position.y > 1.0 || position.y < 0.0 ) {

						worldPos.xyz -= worldFwd * 2.0 * hw;

					}

				#endif

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segments overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
				clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,fragmentShader:`
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			float alpha = opacity;

			#ifdef WORLD_UNITS

				// Find the closest points on the view ray and the line segment
				vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
				vec3 lineDir = worldEnd - worldStart;
				vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

				vec3 p1 = worldStart + lineDir * params.x;
				vec3 p2 = rayEnd * params.y;
				vec3 delta = p1 - p2;
				float len = length( delta );
				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`};new Ze;new I;new I;new Ze;new Ze;new Ze;new I;new je;new kn;new I;new Ke;new mt;new Ze;const Bt={type:"change"},Dt={type:"start"},rn={type:"end"},Xe=new _t,Xt=new Rn,li=Math.cos(70*Un.DEG2RAD),Q=new I,ce=2*Math.PI,k={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},ct=1e-6;let ci=class extends zn{constructor(e,n=null){super(e,n),this.state=k.NONE,this.enabled=!0,this.target=new I,this.cursor=new I,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Ie.ROTATE,MIDDLE:Ie.DOLLY,RIGHT:Ie.PAN},this.touches={ONE:Te.ROTATE,TWO:Te.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new I,this._lastQuaternion=new Yt,this._lastTargetPosition=new I,this._quat=new Yt().setFromUnitVectors(e.up,new I(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Ft,this._sphericalDelta=new Ft,this._scale=1,this._panOffset=new I,this._rotateStart=new oe,this._rotateEnd=new oe,this._rotateDelta=new oe,this._panStart=new oe,this._panEnd=new oe,this._panDelta=new oe,this._dollyStart=new oe,this._dollyEnd=new oe,this._dollyDelta=new oe,this._dollyDirection=new I,this._mouse=new oe,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=hi.bind(this),this._onPointerDown=di.bind(this),this._onPointerUp=ui.bind(this),this._onContextMenu=gi.bind(this),this._onMouseWheel=vi.bind(this),this._onKeyDown=mi.bind(this),this._onTouchStart=_i.bind(this),this._onTouchMove=yi.bind(this),this._onMouseDown=fi.bind(this),this._onMouseMove=pi.bind(this),this._interceptControlDown=xi.bind(this),this._interceptControlUp=bi.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Bt),this.update(),this.state=k.NONE}update(e=null){const n=this.object.position;Q.copy(n).sub(this.target),Q.applyQuaternion(this._quat),this._spherical.setFromVector3(Q),this.autoRotate&&this.state===k.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,o=this.maxAzimuthAngle;isFinite(i)&&isFinite(o)&&(i<-Math.PI?i+=ce:i>Math.PI&&(i-=ce),o<-Math.PI?o+=ce:o>Math.PI&&(o-=ce),i<=o?this._spherical.theta=Math.max(i,Math.min(o,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+o)/2?Math.max(i,this._spherical.theta):Math.min(o,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(Q.setFromSpherical(this._spherical),Q.applyQuaternion(this._quatInverse),n.copy(this.target).add(Q),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const s=Q.length();a=this._clampDistance(s*this._scale);const c=s-a;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){const s=new I(this._mouse.x,this._mouse.y,0);s.unproject(this.object);const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;const l=new I(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(s),this.object.updateMatrixWorld(),a=Q.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Xe.origin.copy(this.object.position),Xe.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Xe.direction))<li?this.object.lookAt(this.target):(Xt.setFromNormalAndCoplanarPoint(this.object.up,this.target),Xe.intersectPlane(Xt,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>ct||8*(1-this._lastQuaternion.dot(this.object.quaternion))>ct||this._lastTargetPosition.distanceToSquared(this.target)>ct?(this.dispatchEvent(Bt),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?ce/60*this.autoRotateSpeed*e:ce/60/60*this.autoRotateSpeed}_getZoomScale(e){const n=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*n)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,n){Q.setFromMatrixColumn(n,0),Q.multiplyScalar(-e),this._panOffset.add(Q)}_panUp(e,n){this.screenSpacePanning===!0?Q.setFromMatrixColumn(n,1):(Q.setFromMatrixColumn(n,0),Q.crossVectors(this.object.up,Q)),Q.multiplyScalar(e),this._panOffset.add(Q)}_pan(e,n){const i=this.domElement;if(this.object.isPerspectiveCamera){const o=this.object.position;Q.copy(o).sub(this.target);let r=Q.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/i.clientHeight,this.object.matrix),this._panUp(2*n*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(n*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,n){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),o=e-i.left,r=n-i.top,a=i.width,s=i.height;this._mouse.x=o/a*2-1,this._mouse.y=-(r/s)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(ce*this._rotateDelta.x/n.clientHeight),this._rotateUp(ce*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let n=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(ce*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),n=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(-ce*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),n=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(ce*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),n=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(-ce*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),n=!0;break}n&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),o=.5*(e.pageY+n.y);this._rotateStart.set(i,o)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),o=.5*(e.pageY+n.y);this._panStart.set(i,o)}}_handleTouchStartDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,o=e.pageY-n.y,r=Math.sqrt(i*i+o*o);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),o=.5*(e.pageX+i.x),r=.5*(e.pageY+i.y);this._rotateEnd.set(o,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(ce*this._rotateDelta.x/n.clientHeight),this._rotateUp(ce*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),o=.5*(e.pageY+n.y);this._panEnd.set(i,o)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,o=e.pageY-n.y,r=Math.sqrt(i*i+o*o);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+n.x)*.5,s=(e.pageY+n.y)*.5;this._updateZoomParameters(a,s)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId){this._pointers.splice(n,1);return}}_isTrackingPointer(e){for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId)return!0;return!1}_trackPointer(e){let n=this._pointerPositions[e.pointerId];n===void 0&&(n=new oe,this._pointerPositions[e.pointerId]=n),n.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const n=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[n]}_customWheelEvent(e){const n=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(n){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}};function di(t){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(t.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(t)&&(this._addPointer(t),t.pointerType==="touch"?this._onTouchStart(t):this._onMouseDown(t)))}function hi(t){this.enabled!==!1&&(t.pointerType==="touch"?this._onTouchMove(t):this._onMouseMove(t))}function ui(t){switch(this._removePointer(t),this._pointers.length){case 0:this.domElement.releasePointerCapture(t.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(rn),this.state=k.NONE;break;case 1:const e=this._pointers[0],n=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:n.x,pageY:n.y});break}}function fi(t){let e;switch(t.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Ie.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(t),this.state=k.DOLLY;break;case Ie.ROTATE:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=k.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=k.ROTATE}break;case Ie.PAN:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=k.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=k.PAN}break;default:this.state=k.NONE}this.state!==k.NONE&&this.dispatchEvent(Dt)}function pi(t){switch(this.state){case k.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(t);break;case k.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(t);break;case k.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(t);break}}function vi(t){this.enabled===!1||this.enableZoom===!1||this.state!==k.NONE||(t.preventDefault(),this.dispatchEvent(Dt),this._handleMouseWheel(this._customWheelEvent(t)),this.dispatchEvent(rn))}function mi(t){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(t)}function _i(t){switch(this._trackPointer(t),this._pointers.length){case 1:switch(this.touches.ONE){case Te.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(t),this.state=k.TOUCH_ROTATE;break;case Te.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(t),this.state=k.TOUCH_PAN;break;default:this.state=k.NONE}break;case 2:switch(this.touches.TWO){case Te.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(t),this.state=k.TOUCH_DOLLY_PAN;break;case Te.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(t),this.state=k.TOUCH_DOLLY_ROTATE;break;default:this.state=k.NONE}break;default:this.state=k.NONE}this.state!==k.NONE&&this.dispatchEvent(Dt)}function yi(t){switch(this._trackPointer(t),this.state){case k.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(t),this.update();break;case k.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(t),this.update();break;case k.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(t),this.update();break;case k.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(t),this.update();break;default:this.state=k.NONE}}function gi(t){this.enabled!==!1&&t.preventDefault()}function xi(t){t.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function bi(t){t.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const wi=()=>Qn("threlte-controls",{orbitControls:Ut(void 0),trackballControls:Ut(void 0)});function Di(t,e){pt(e,!0);const n=()=>Cn(s,"$parent",i),[i,o]=Tn();let r=Ve(e,"ref",15),a=An(e,["$$slots","$$events","$$legacy","ref","children"]);const s=Hn(),{dom:c,invalidate:l}=Jt();if(!en(n(),"Camera"))throw new Error("Parent missing: <OrbitControls> need to be a child of a <Camera>");const m=new ci(n(),c),{orbitControls:g}=wi();Yn(()=>{m.update()},{running:()=>e.autoRotate??e.enableDamping??!1}),xn(()=>{const _=O=>{l(),e.onchange?.(O)};return g.set(m),m.addEventListener("change",_),()=>{g.set(void 0),m.removeEventListener("change",_)}}),b(t,On({get is(){return m}},()=>a,{get ref(){return r()},set ref(_){r(_)},children:(_,O)=>{var M=bn(),W=ie(M);Kn(W,()=>e.children??wn,()=>({ref:m})),G(_,M)},$$slots:{default:!0}})),vt(),o()}new je;new je;new tn;`${ge.logdepthbuf_pars_vertex}${ge.fog_pars_vertex}${ge.logdepthbuf_vertex}${ge.fog_vertex}`;`${ge.tonemapping_fragment}${ge.colorspace_fragment}`;`${ge.tonemapping_fragment}${ge.colorspace_fragment}`;const Mi=`

// A stack of uint32 indices can can store the indices for
// a perfectly balanced tree with a depth up to 31. Lower stack
// depth gets higher performance.
//
// However not all trees are balanced. Best value to set this to
// is the trees max depth.
#ifndef BVH_STACK_DEPTH
#define BVH_STACK_DEPTH 60
#endif

#ifndef INFINITY
#define INFINITY 1e20
#endif

// Utilities
uvec4 uTexelFetch1D( usampler2D tex, uint index ) {

	uint width = uint( textureSize( tex, 0 ).x );
	uvec2 uv;
	uv.x = index % width;
	uv.y = index / width;

	return texelFetch( tex, ivec2( uv ), 0 );

}

ivec4 iTexelFetch1D( isampler2D tex, uint index ) {

	uint width = uint( textureSize( tex, 0 ).x );
	uvec2 uv;
	uv.x = index % width;
	uv.y = index / width;

	return texelFetch( tex, ivec2( uv ), 0 );

}

vec4 texelFetch1D( sampler2D tex, uint index ) {

	uint width = uint( textureSize( tex, 0 ).x );
	uvec2 uv;
	uv.x = index % width;
	uv.y = index / width;

	return texelFetch( tex, ivec2( uv ), 0 );

}

vec4 textureSampleBarycoord( sampler2D tex, vec3 barycoord, uvec3 faceIndices ) {

	return
		barycoord.x * texelFetch1D( tex, faceIndices.x ) +
		barycoord.y * texelFetch1D( tex, faceIndices.y ) +
		barycoord.z * texelFetch1D( tex, faceIndices.z );

}

void ndcToCameraRay(
	vec2 coord, mat4 cameraWorld, mat4 invProjectionMatrix,
	out vec3 rayOrigin, out vec3 rayDirection
) {

	// get camera look direction and near plane for camera clipping
	vec4 lookDirection = cameraWorld * vec4( 0.0, 0.0, - 1.0, 0.0 );
	vec4 nearVector = invProjectionMatrix * vec4( 0.0, 0.0, - 1.0, 1.0 );
	float near = abs( nearVector.z / nearVector.w );

	// get the camera direction and position from camera matrices
	vec4 origin = cameraWorld * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec4 direction = invProjectionMatrix * vec4( coord, 0.5, 1.0 );
	direction /= direction.w;
	direction = cameraWorld * direction - origin;

	// slide the origin along the ray until it sits at the near clip plane position
	origin.xyz += direction.xyz * near / dot( direction, lookDirection );

	rayOrigin = origin.xyz;
	rayDirection = direction.xyz;

}
`,Si=`

#ifndef TRI_INTERSECT_EPSILON
#define TRI_INTERSECT_EPSILON 1e-5
#endif

// Raycasting
bool intersectsBounds( vec3 rayOrigin, vec3 rayDirection, vec3 boundsMin, vec3 boundsMax, out float dist ) {

	// https://www.reddit.com/r/opengl/comments/8ntzz5/fast_glsl_ray_box_intersection/
	// https://tavianator.com/2011/ray_box.html
	vec3 invDir = 1.0 / rayDirection;

	// find intersection distances for each plane
	vec3 tMinPlane = invDir * ( boundsMin - rayOrigin );
	vec3 tMaxPlane = invDir * ( boundsMax - rayOrigin );

	// get the min and max distances from each intersection
	vec3 tMinHit = min( tMaxPlane, tMinPlane );
	vec3 tMaxHit = max( tMaxPlane, tMinPlane );

	// get the furthest hit distance
	vec2 t = max( tMinHit.xx, tMinHit.yz );
	float t0 = max( t.x, t.y );

	// get the minimum hit distance
	t = min( tMaxHit.xx, tMaxHit.yz );
	float t1 = min( t.x, t.y );

	// set distance to 0.0 if the ray starts inside the box
	dist = max( t0, 0.0 );

	return t1 >= dist;

}

bool intersectsTriangle(
	vec3 rayOrigin, vec3 rayDirection, vec3 a, vec3 b, vec3 c,
	out vec3 barycoord, out vec3 norm, out float dist, out float side
) {

	// https://stackoverflow.com/questions/42740765/intersection-between-line-and-triangle-in-3d
	vec3 edge1 = b - a;
	vec3 edge2 = c - a;
	norm = cross( edge1, edge2 );

	float det = - dot( rayDirection, norm );
	float invdet = 1.0 / det;

	vec3 AO = rayOrigin - a;
	vec3 DAO = cross( AO, rayDirection );

	vec4 uvt;
	uvt.x = dot( edge2, DAO ) * invdet;
	uvt.y = - dot( edge1, DAO ) * invdet;
	uvt.z = dot( AO, norm ) * invdet;
	uvt.w = 1.0 - uvt.x - uvt.y;

	// set the hit information
	barycoord = uvt.wxy; // arranged in A, B, C order
	dist = uvt.z;
	side = sign( det );
	norm = side * normalize( norm );

	// add an epsilon to avoid misses between triangles
	uvt += vec4( TRI_INTERSECT_EPSILON );

	return all( greaterThanEqual( uvt, vec4( 0.0 ) ) );

}

bool intersectTriangles(
	// geometry info and triangle range
	sampler2D positionAttr, usampler2D indexAttr, uint offset, uint count,

	// ray
	vec3 rayOrigin, vec3 rayDirection,

	// outputs
	inout float minDistance, inout uvec4 faceIndices, inout vec3 faceNormal, inout vec3 barycoord,
	inout float side, inout float dist
) {

	bool found = false;
	vec3 localBarycoord, localNormal;
	float localDist, localSide;
	for ( uint i = offset, l = offset + count; i < l; i ++ ) {

		uvec3 indices = uTexelFetch1D( indexAttr, i ).xyz;
		vec3 a = texelFetch1D( positionAttr, indices.x ).rgb;
		vec3 b = texelFetch1D( positionAttr, indices.y ).rgb;
		vec3 c = texelFetch1D( positionAttr, indices.z ).rgb;

		if (
			intersectsTriangle( rayOrigin, rayDirection, a, b, c, localBarycoord, localNormal, localDist, localSide )
			&& localDist < minDistance
		) {

			found = true;
			minDistance = localDist;

			faceIndices = uvec4( indices.xyz, i );
			faceNormal = localNormal;

			side = localSide;
			barycoord = localBarycoord;
			dist = localDist;

		}

	}

	return found;

}

bool intersectsBVHNodeBounds( vec3 rayOrigin, vec3 rayDirection, sampler2D bvhBounds, uint currNodeIndex, out float dist ) {

	uint cni2 = currNodeIndex * 2u;
	vec3 boundsMin = texelFetch1D( bvhBounds, cni2 ).xyz;
	vec3 boundsMax = texelFetch1D( bvhBounds, cni2 + 1u ).xyz;
	return intersectsBounds( rayOrigin, rayDirection, boundsMin, boundsMax, dist );

}

// use a macro to hide the fact that we need to expand the struct into separate fields
#define	bvhIntersectFirstHit(		bvh,		rayOrigin, rayDirection, faceIndices, faceNormal, barycoord, side, dist	)	_bvhIntersectFirstHit(		bvh.position, bvh.index, bvh.bvhBounds, bvh.bvhContents,		rayOrigin, rayDirection, faceIndices, faceNormal, barycoord, side, dist	)

bool _bvhIntersectFirstHit(
	// bvh info
	sampler2D bvh_position, usampler2D bvh_index, sampler2D bvh_bvhBounds, usampler2D bvh_bvhContents,

	// ray
	vec3 rayOrigin, vec3 rayDirection,

	// output variables split into separate variables due to output precision
	inout uvec4 faceIndices, inout vec3 faceNormal, inout vec3 barycoord,
	inout float side, inout float dist
) {

	// stack needs to be twice as long as the deepest tree we expect because
	// we push both the left and right child onto the stack every traversal
	int pointer = 0;
	uint stack[ BVH_STACK_DEPTH ];
	stack[ 0 ] = 0u;

	float triangleDistance = INFINITY;
	bool found = false;
	while ( pointer > - 1 && pointer < BVH_STACK_DEPTH ) {

		uint currNodeIndex = stack[ pointer ];
		pointer --;

		// check if we intersect the current bounds
		float boundsHitDistance;
		if (
			! intersectsBVHNodeBounds( rayOrigin, rayDirection, bvh_bvhBounds, currNodeIndex, boundsHitDistance )
			|| boundsHitDistance > triangleDistance
		) {

			continue;

		}

		uvec2 boundsInfo = uTexelFetch1D( bvh_bvhContents, currNodeIndex ).xy;
		bool isLeaf = bool( boundsInfo.x & 0xffff0000u );

		if ( isLeaf ) {

			uint count = boundsInfo.x & 0x0000ffffu;
			uint offset = boundsInfo.y;

			found = intersectTriangles(
				bvh_position, bvh_index, offset, count,
				rayOrigin, rayDirection, triangleDistance,
				faceIndices, faceNormal, barycoord, side, dist
			) || found;

		} else {

			uint leftIndex = currNodeIndex + 1u;
			uint splitAxis = boundsInfo.x & 0x0000ffffu;
			uint rightIndex = currNodeIndex + boundsInfo.y;

			bool leftToRight = rayDirection[ splitAxis ] >= 0.0;
			uint c1 = leftToRight ? leftIndex : rightIndex;
			uint c2 = leftToRight ? rightIndex : leftIndex;

			// set c2 in the stack so we traverse it later. We need to keep track of a pointer in
			// the stack while we traverse. The second pointer added is the one that will be
			// traversed first
			pointer ++;
			stack[ pointer ] = c2;

			pointer ++;
			stack[ pointer ] = c1;

		}

	}

	return found;

}
`,Pi=`
struct BVH {

	usampler2D index;
	sampler2D position;

	sampler2D bvhBounds;
	usampler2D bvhContents;

};
`,Ei=Pi,Oi=`
	${Mi}
	${Si}
`;`${Ei}${Oi}${ge.tonemapping_fragment}${ge.colorspace_fragment}`;new Ke;typeof window<"u"&&document.createElement("div");const Ci=t=>{const{camera:e}=Jt();let n=t.current.clientWidth,i=t.current.clientHeight;const o=new ResizeObserver(([r])=>{n=r.contentRect.width,i=r.contentRect.height});return nn(t,r=>(r&&o.observe(r),()=>{r&&o.unobserve(r)})),(r,a)=>{a.pointer.update(s=>(s.set(r.offsetX/n*2-1,-(r.offsetY/i)*2+1),s)),a.raycaster.setFromCamera(a.pointer.current,e.current)}},an=Symbol("interactivity-context"),Ti=()=>Qt(an),Ai=t=>{const e=me(Fn().dom),n={enabled:me(!0),pointer:me(new oe),pointerOverTarget:me(!1),lastEvent:void 0,raycaster:new Zn,initialClick:[0,0],initialHits:[],hovered:new Map,interactiveObjects:[],target:e,handlers:new WeakMap,compute:Ci(e),filter:t?.filter,addInteractiveObject:(i,o)=>{n.interactiveObjects.indexOf(i)>-1||(n.handlers.set(i,o),n.interactiveObjects.push(i))},removeInteractiveObject:i=>{const o=n.interactiveObjects.indexOf(i);n.interactiveObjects.splice(o,1),n.handlers.delete(i)}};return qt(an,n),n},sn=()=>{const t=Ti();if(!t)throw new Error("No interactivity context found. Did you forget to implement interactivity()?");return t},Gt=["onclick","oncontextmenu","ondblclick","onwheel","onpointerup","onpointerdown","onpointerover","onpointerout","onpointerenter","onpointerleave","onpointermove","onpointermissed"],Ii=()=>{qn("interactivity",t=>{if(!en(t.ref,"Object3D")||!Object.entries(t.props).some(([o,r])=>r!==void 0&&Gt.includes(o)))return;const{addInteractiveObject:n,removeInteractiveObject:i}=sn();return Bn.pre(()=>[t.ref],([o])=>(n(o,t.props),()=>{i(o)})),{pluginProps:Gt}})};function Wt(t){return`${(t.eventObject||t.object).uuid}|${t.index}|${t.instanceId}`}const Vt=[["click",!1],["contextmenu",!1],["dblclick",!1],["wheel",!1],["pointerdown",!0],["pointerup",!0],["pointerleave",!0],["pointerenter",!0],["pointermove",!0],["pointercancel",!0]],ji=t=>{const{handlers:e}=sn(),n=d=>{const f=d.offsetX-t.initialClick[0],u=d.offsetY-t.initialClick[1];return Math.round(Math.hypot(f,u))},i=d=>{if(t.hovered.size===0)return;const f=new Set;for(const u of d)f.add(Wt(u));for(const[u,h]of t.hovered)if(!f.has(u)){const{eventObject:P}=h;t.hovered.delete(u);const Z=e.get(P);if(Z){const C={...h,intersections:d};Z.onpointerout?.(C),Z.onpointerleave?.(C)}}},o=()=>{if(!t.enabled.current)return[];const d=[],f=t.raycaster.intersectObjects(t.interactiveObjects,!0),u=t.filter===void 0?f:t.filter(f,t);for(const h of u){let P=h.object;for(;P;)e.has(P)&&d.push({...h,eventObject:P}),P=P.parent}return d},r=(d,f)=>{for(const u of f)e.get(u)?.onpointermissed?.(d)},a=()=>{t.pointerOverTarget.set(!1),i([])},s=()=>{t.pointerOverTarget.set(!0)},c=d=>{const f=d.type,u=f==="pointermove",h=f==="click"||f==="contextmenu"||f==="dblclick";t.compute(d,t);const P=o(),Z=h?n(d):0;f==="pointerdown"&&(t.initialClick=[d.offsetX,d.offsetY],t.initialHits=P.map(ee=>ee.eventObject)),h&&P.length===0&&Z<=2&&r(d,t.interactiveObjects),u&&i(P);let C=!1;e:for(const ee of P){const K=e.get(ee.eventObject);if(!K)continue;const ne={stopped:C,...ee,intersections:P,stopPropagation(){if(C=!0,ne.stopped=!0,t.hovered.size>0&&Array.from(t.hovered.values()).some(re=>re.eventObject===ee.eventObject)){const re=P.slice(0,P.indexOf(ee));i([...re,ee])}},camera:t.raycaster.camera,delta:Z,nativeEvent:d,pointer:t.pointer.current,ray:t.raycaster.ray};if(u){if(K.onpointerover||K.onpointerenter||K.onpointerout||K.onpointerleave){const re=Wt(ne),Se=t.hovered.get(re);Se?Se.stopped&&ne.stopPropagation():(t.hovered.set(re,ne),K.onpointerover?.(ne),K.onpointerenter?.(ne))}K.onpointermove?.(ne)}else K[`on${f}`]?(!h||t.initialHits.includes(ee.eventObject))&&(r(d,t.interactiveObjects.filter(re=>!t.initialHits.includes(re))),K[`on${f}`]?.(ne)):h&&t.initialHits.includes(ee.eventObject)&&r(d,t.interactiveObjects.filter(re=>!t.initialHits.includes(re)));if(C)break e}};let l=0,m=null,g=-1/0,_=-1/0;const O=.25,M=d=>{Math.abs(d.offsetX-g)<O&&Math.abs(d.offsetY-_)<O||(g=d.offsetX,_=d.offsetY,m=d,l||(l=requestAnimationFrame(()=>{l=0,m&&(c(m),m=null)})))},W=d=>{for(const[f]of Vt)f==="pointerleave"||f==="pointercancel"?d.removeEventListener(f,a):f==="pointermove"?d.removeEventListener(f,M):f==="pointerenter"?d.removeEventListener(f,s):d.removeEventListener(f,c)},$=d=>{for(const[f,u]of Vt)f==="pointerleave"||f==="pointercancel"?d.addEventListener(f,a,{passive:u}):f==="pointermove"?d.addEventListener(f,M,{passive:u}):f==="pointerenter"?d.addEventListener(f,s,{passive:u}):d.addEventListener(f,c,{passive:u})};nn(t.target,d=>(d&&$(d),()=>{d&&W(d)}))},Li=t=>{const e=Ai(t);return Ii(),ji(e),e};for(let t=0;t<256;t++)(t<16?"0":"")+t.toString(16);new Xn(-1,1,1,-1,0,1);class Ni extends Gn{constructor(){super(),this.setAttribute("position",new Zt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Zt([0,2,0,0,2,0],2))}}new Ni;var ln={exports:{}};ln.exports=Qe;ln.exports.default=Qe;function Qe(t,e,n){n=n||2;var i=e&&e.length,o=i?e[0]*n:t.length,r=cn(t,0,o,n,!0),a=[];if(!r||r.next===r.prev)return a;var s,c,l,m,g,_,O;if(i&&(r=Hi(t,e,r,n)),t.length>80*n){s=l=t[0],c=m=t[1];for(var M=n;M<o;M+=n)g=t[M],_=t[M+1],g<s&&(s=g),_<c&&(c=_),g>l&&(l=g),_>m&&(m=_);O=Math.max(l-s,m-c),O=O!==0?32767/O:0}return Ue(r,a,n,s,c,O,0),a}function cn(t,e,n,i,o){var r,a;if(o===ft(t,e,n,i)>0)for(r=e;r<n;r+=i)a=$t(r,t[r],t[r+1],a);else for(r=n-i;r>=e;r-=i)a=$t(r,t[r],t[r+1],a);return a&&Je(a,a.next)&&(Ye(a),a=a.next),a}function Ee(t,e){if(!t)return t;e||(e=t);var n=t,i;do if(i=!1,!n.steiner&&(Je(n,n.next)||B(n.prev,n,n.next)===0)){if(Ye(n),n=e=n.prev,n===n.next)break;i=!0}else n=n.next;while(i||n!==e);return e}function Ue(t,e,n,i,o,r,a){if(t){!a&&r&&Xi(t,i,o,r);for(var s=t,c,l;t.prev!==t.next;){if(c=t.prev,l=t.next,r?zi(t,i,o,r):ki(t)){e.push(c.i/n|0),e.push(t.i/n|0),e.push(l.i/n|0),Ye(t),t=l.next,s=l.next;continue}if(t=l,t===s){a?a===1?(t=Ri(Ee(t),e,n),Ue(t,e,n,i,o,r,2)):a===2&&Ui(t,e,n,i,o,r):Ue(Ee(t),e,n,i,o,r,1);break}}}}function ki(t){var e=t.prev,n=t,i=t.next;if(B(e,n,i)>=0)return!1;for(var o=e.x,r=n.x,a=i.x,s=e.y,c=n.y,l=i.y,m=o<r?o<a?o:a:r<a?r:a,g=s<c?s<l?s:l:c<l?c:l,_=o>r?o>a?o:a:r>a?r:a,O=s>c?s>l?s:l:c>l?c:l,M=i.next;M!==e;){if(M.x>=m&&M.x<=_&&M.y>=g&&M.y<=O&&Ae(o,s,r,c,a,l,M.x,M.y)&&B(M.prev,M,M.next)>=0)return!1;M=M.next}return!0}function zi(t,e,n,i){var o=t.prev,r=t,a=t.next;if(B(o,r,a)>=0)return!1;for(var s=o.x,c=r.x,l=a.x,m=o.y,g=r.y,_=a.y,O=s<c?s<l?s:l:c<l?c:l,M=m<g?m<_?m:_:g<_?g:_,W=s>c?s>l?s:l:c>l?c:l,$=m>g?m>_?m:_:g>_?g:_,d=ht(O,M,e,n,i),f=ht(W,$,e,n,i),u=t.prevZ,h=t.nextZ;u&&u.z>=d&&h&&h.z<=f;){if(u.x>=O&&u.x<=W&&u.y>=M&&u.y<=$&&u!==o&&u!==a&&Ae(s,m,c,g,l,_,u.x,u.y)&&B(u.prev,u,u.next)>=0||(u=u.prevZ,h.x>=O&&h.x<=W&&h.y>=M&&h.y<=$&&h!==o&&h!==a&&Ae(s,m,c,g,l,_,h.x,h.y)&&B(h.prev,h,h.next)>=0))return!1;h=h.nextZ}for(;u&&u.z>=d;){if(u.x>=O&&u.x<=W&&u.y>=M&&u.y<=$&&u!==o&&u!==a&&Ae(s,m,c,g,l,_,u.x,u.y)&&B(u.prev,u,u.next)>=0)return!1;u=u.prevZ}for(;h&&h.z<=f;){if(h.x>=O&&h.x<=W&&h.y>=M&&h.y<=$&&h!==o&&h!==a&&Ae(s,m,c,g,l,_,h.x,h.y)&&B(h.prev,h,h.next)>=0)return!1;h=h.nextZ}return!0}function Ri(t,e,n){var i=t;do{var o=i.prev,r=i.next.next;!Je(o,r)&&dn(o,i,i.next,r)&&He(o,r)&&He(r,o)&&(e.push(o.i/n|0),e.push(i.i/n|0),e.push(r.i/n|0),Ye(i),Ye(i.next),i=t=r),i=i.next}while(i!==t);return Ee(i)}function Ui(t,e,n,i,o,r){var a=t;do{for(var s=a.next.next;s!==a.prev;){if(a.i!==s.i&&Vi(a,s)){var c=hn(a,s);a=Ee(a,a.next),c=Ee(c,c.next),Ue(a,e,n,i,o,r,0),Ue(c,e,n,i,o,r,0);return}s=s.next}a=a.next}while(a!==t)}function Hi(t,e,n,i){var o=[],r,a,s,c,l;for(r=0,a=e.length;r<a;r++)s=e[r]*i,c=r<a-1?e[r+1]*i:t.length,l=cn(t,s,c,i,!1),l===l.next&&(l.steiner=!0),o.push(Wi(l));for(o.sort(Yi),r=0;r<o.length;r++)n=Fi(o[r],n);return n}function Yi(t,e){return t.x-e.x}function Fi(t,e){var n=Zi(t,e);if(!n)return e;var i=hn(n,t);return Ee(i,i.next),Ee(n,n.next)}function Zi(t,e){var n=e,i=t.x,o=t.y,r=-1/0,a;do{if(o<=n.y&&o>=n.next.y&&n.next.y!==n.y){var s=n.x+(o-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(s<=i&&s>r&&(r=s,a=n.x<n.next.x?n:n.next,s===i))return a}n=n.next}while(n!==e);if(!a)return null;var c=a,l=a.x,m=a.y,g=1/0,_;n=a;do i>=n.x&&n.x>=l&&i!==n.x&&Ae(o<m?i:r,o,l,m,o<m?r:i,o,n.x,n.y)&&(_=Math.abs(o-n.y)/(i-n.x),He(n,t)&&(_<g||_===g&&(n.x>a.x||n.x===a.x&&Bi(a,n)))&&(a=n,g=_)),n=n.next;while(n!==c);return a}function Bi(t,e){return B(t.prev,t,e.prev)<0&&B(e.next,t,t.next)<0}function Xi(t,e,n,i){var o=t;do o.z===0&&(o.z=ht(o.x,o.y,e,n,i)),o.prevZ=o.prev,o.nextZ=o.next,o=o.next;while(o!==t);o.prevZ.nextZ=null,o.prevZ=null,Gi(o)}function Gi(t){var e,n,i,o,r,a,s,c,l=1;do{for(n=t,t=null,r=null,a=0;n;){for(a++,i=n,s=0,e=0;e<l&&(s++,i=i.nextZ,!!i);e++);for(c=l;s>0||c>0&&i;)s!==0&&(c===0||!i||n.z<=i.z)?(o=n,n=n.nextZ,s--):(o=i,i=i.nextZ,c--),r?r.nextZ=o:t=o,o.prevZ=r,r=o;n=i}r.nextZ=null,l*=2}while(a>1);return t}function ht(t,e,n,i,o){return t=(t-n)*o|0,e=(e-i)*o|0,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t|e<<1}function Wi(t){var e=t,n=t;do(e.x<n.x||e.x===n.x&&e.y<n.y)&&(n=e),e=e.next;while(e!==t);return n}function Ae(t,e,n,i,o,r,a,s){return(o-a)*(e-s)>=(t-a)*(r-s)&&(t-a)*(i-s)>=(n-a)*(e-s)&&(n-a)*(r-s)>=(o-a)*(i-s)}function Vi(t,e){return t.next.i!==e.i&&t.prev.i!==e.i&&!$i(t,e)&&(He(t,e)&&He(e,t)&&Ki(t,e)&&(B(t.prev,t,e.prev)||B(t,e.prev,e))||Je(t,e)&&B(t.prev,t,t.next)>0&&B(e.prev,e,e.next)>0)}function B(t,e,n){return(e.y-t.y)*(n.x-e.x)-(e.x-t.x)*(n.y-e.y)}function Je(t,e){return t.x===e.x&&t.y===e.y}function dn(t,e,n,i){var o=We(B(t,e,n)),r=We(B(t,e,i)),a=We(B(n,i,t)),s=We(B(n,i,e));return!!(o!==r&&a!==s||o===0&&Ge(t,n,e)||r===0&&Ge(t,i,e)||a===0&&Ge(n,t,i)||s===0&&Ge(n,e,i))}function Ge(t,e,n){return e.x<=Math.max(t.x,n.x)&&e.x>=Math.min(t.x,n.x)&&e.y<=Math.max(t.y,n.y)&&e.y>=Math.min(t.y,n.y)}function We(t){return t>0?1:t<0?-1:0}function $i(t,e){var n=t;do{if(n.i!==t.i&&n.next.i!==t.i&&n.i!==e.i&&n.next.i!==e.i&&dn(n,n.next,t,e))return!0;n=n.next}while(n!==t);return!1}function He(t,e){return B(t.prev,t,t.next)<0?B(t,e,t.next)>=0&&B(t,t.prev,e)>=0:B(t,e,t.prev)<0||B(t,t.next,e)<0}function Ki(t,e){var n=t,i=!1,o=(t.x+e.x)/2,r=(t.y+e.y)/2;do n.y>r!=n.next.y>r&&n.next.y!==n.y&&o<(n.next.x-n.x)*(r-n.y)/(n.next.y-n.y)+n.x&&(i=!i),n=n.next;while(n!==t);return i}function hn(t,e){var n=new ut(t.i,t.x,t.y),i=new ut(e.i,e.x,e.y),o=t.next,r=e.prev;return t.next=e,e.prev=t,n.next=o,o.prev=n,i.next=n,n.prev=i,r.next=i,i.prev=r,i}function $t(t,e,n,i){var o=new ut(t,e,n);return i?(o.next=i.next,o.prev=i,i.next.prev=o,i.next=o):(o.prev=o,o.next=o),o}function Ye(t){t.next.prev=t.prev,t.prev.next=t.next,t.prevZ&&(t.prevZ.nextZ=t.nextZ),t.nextZ&&(t.nextZ.prevZ=t.prevZ)}function ut(t,e,n){this.i=t,this.x=e,this.y=n,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}Qe.deviation=function(t,e,n,i){var o=e&&e.length,r=o?e[0]*n:t.length,a=Math.abs(ft(t,0,r,n));if(o)for(var s=0,c=e.length;s<c;s++){var l=e[s]*n,m=s<c-1?e[s+1]*n:t.length;a-=Math.abs(ft(t,l,m,n))}var g=0;for(s=0;s<i.length;s+=3){var _=i[s]*n,O=i[s+1]*n,M=i[s+2]*n;g+=Math.abs((t[_]-t[M])*(t[O+1]-t[_+1])-(t[_]-t[O])*(t[M+1]-t[_+1]))}return a===0&&g===0?0:Math.abs((g-a)/a)};function ft(t,e,n,i){for(var o=0,r=e,a=n-i;r<n;r+=i)o+=(t[a]-t[r])*(t[r+1]+t[a+1]),a=r;return o}Qe.flatten=function(t){for(var e=t[0][0].length,n={vertices:[],holes:[],dimensions:e},i=0,o=0;o<t.length;o++){for(var r=0;r<t[o].length;r++)for(var a=0;a<e;a++)n.vertices.push(t[o][r][a]);o>0&&(i+=t[o-1].length,n.holes.push(i))}return n};new oe;new oe;var Kt;(t=>{function e(o){let r=o.slice();return r.sort(t.POINT_COMPARATOR),t.makeHullPresorted(r)}t.makeHull=e;function n(o){if(o.length<=1)return o.slice();let r=[];for(let s=0;s<o.length;s++){const c=o[s];for(;r.length>=2;){const l=r[r.length-1],m=r[r.length-2];if((l.x-m.x)*(c.y-m.y)>=(l.y-m.y)*(c.x-m.x))r.pop();else break}r.push(c)}r.pop();let a=[];for(let s=o.length-1;s>=0;s--){const c=o[s];for(;a.length>=2;){const l=a[a.length-1],m=a[a.length-2];if((l.x-m.x)*(c.y-m.y)>=(l.y-m.y)*(c.x-m.x))a.pop();else break}a.push(c)}return a.pop(),r.length==1&&a.length==1&&r[0].x==a[0].x&&r[0].y==a[0].y?r:r.concat(a)}t.makeHullPresorted=n;function i(o,r){return o.x<r.x?-1:o.x>r.x?1:o.y<r.y?-1:o.y>r.y?1:0}t.POINT_COMPARATOR=i})(Kt||(Kt={}));new Wn;new I;new je;new _t;new mt;new Ke;new I;new I;var qi=V("<!> <!>",1),Qi=V("<!> <!>",1),Ji=V("<!> <!>",1),eo=V("<!> <!>",1),to=V("<!> <!>",1),no=V("<!> <!>",1),io=V("<!> <!>",1),oo=V("<!> <!>",1),ro=V("<!> <!>",1),ao=V("<!> <!>",1),so=V("<!> <!>",1),lo=V("<!> <!>",1),co=V("<!> <!>",1),ho=V("<!> <!>",1),uo=V("<!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!>",1),fo=V("<!> <!> <!> <!> <!> <!> <!>",1);function po(t,e){pt(e,!0),Li();let n=we(!1),i=we(!0);const o=20,r=20,a="#374151",s="#1f2937",c=.04,l=.3,m=.12,g=.2,_="#facc15",O=20;let M=!1,W,$="x",d=0,f=0,u=!1;function h(z,Y,q){q.stopPropagation(),z&&(M=!0,W=z,$=Y,u=!1,f=0,d=Y==="x"?q.event?.clientX??0:q.event?.clientY??0,X(i,!1),document.addEventListener("pointermove",P),document.addEventListener("pointerup",Z,{once:!0}))}function P(z){if(!M)return;const Y=$==="x"?z.clientX:z.clientY,q=Y-d;d=Y;const he=$==="y"?-q:q;for(f+=he;f>=O;)W?.(1),f-=O,u=!0;for(;f<=-O;)W?.(-1),f+=O,u=!0}function Z(){M=!1,W=void 0,X(i,!0),document.removeEventListener("pointermove",P)}function C(z,Y,q){if(u){u=!1;return}z.stopPropagation(),Y?.(q)}Dn(()=>()=>{document.removeEventListener("pointermove",P)});var ee=fo(),K=ie(ee);w(K,()=>b.PerspectiveCamera,(z,Y)=>{Y(z,{makeDefault:!0,position:[50,35,55],fov:45,children:(q,he)=>{Di(q,{enableDamping:!0,dampingFactor:.05,get enabled(){return v(i)}})},$$slots:{default:!0}})});var ne=y(K,2);w(ne,()=>b.AmbientLight,(z,Y)=>{Y(z,{intensity:.5})});var re=y(ne,2);w(re,()=>b.DirectionalLight,(z,Y)=>{Y(z,{position:[5,10,5],intensity:1.2,castShadow:!0})});var Se=y(re,2);w(Se,()=>b.GridHelper,(z,Y)=>{Y(z,{args:[o,r,a,s],position:[0,0,0]})});var de=y(Se,2);{let z=J(()=>[0,e.dimY/2,0]);w(de,()=>b.Mesh,(Y,q)=>{q(Y,{get position(){return v(z)},castShadow:!0,receiveShadow:!0,onclick:he=>{he.stopPropagation(),X(n,!v(n))},children:(he,De)=>{var ue=qi(),_e=ie(ue);{let ae=J(()=>[e.dimX,e.dimY,e.dimZ]);w(_e,()=>b.BoxGeometry,(se,ve)=>{ve(se,{get args(){return v(ae)}})})}var ye=y(_e,2);{let ae=J(()=>v(n)?"#86efac":"#4ade80");w(ye,()=>b.MeshStandardMaterial,(se,ve)=>{ve(se,{get color(){return v(ae)},metalness:.3,roughness:.5})})}G(he,ue)},$$slots:{default:!0}})})}var Oe=y(de,2);{let z=J(()=>[0,e.dimY/2,0]);w(Oe,()=>b.Mesh,(Y,q)=>{q(Y,{get position(){return v(z)},children:(he,De)=>{var ue=Qi(),_e=ie(ue);{let ae=J(()=>[e.dimX,e.dimY,e.dimZ]);w(_e,()=>b.BoxGeometry,(se,ve)=>{ve(se,{get args(){return v(ae)}})})}var ye=y(_e,2);w(ye,()=>b.MeshBasicMaterial,(ae,se)=>{se(ae,{color:"#166534",wireframe:!0})}),G(he,ue)},$$slots:{default:!0}})})}var Le=y(Oe,2);{var Ne=z=>{var Y=uo(),q=ie(Y);{let R=J(()=>[e.dimX/2+l/2,e.dimY/2,0]);w(q,()=>b.Mesh,(F,A)=>{A(F,{get position(){return v(R)},rotation:[0,0,-Math.PI/2],onclick:p=>C(p,e.onAdjustX,1),onpointerdown:p=>h(e.onAdjustX,"x",p),children:(p,te)=>{var E=Ji(),T=ie(E);w(T,()=>b.CylinderGeometry,(x,S)=>{S(x,{args:[c,c,l,8]})});var L=y(T,2);w(L,()=>b.MeshStandardMaterial,(x,S)=>{S(x,{color:_})}),G(p,E)},$$slots:{default:!0}})})}var he=y(q,2);{let R=J(()=>[e.dimX/2+l+g/2,e.dimY/2,0]);w(he,()=>b.Mesh,(F,A)=>{A(F,{get position(){return v(R)},rotation:[0,0,-Math.PI/2],onclick:p=>C(p,e.onAdjustX,1),onpointerdown:p=>h(e.onAdjustX,"x",p),children:(p,te)=>{var E=eo(),T=ie(E);w(T,()=>b.ConeGeometry,(x,S)=>{S(x,{args:[m,g,8]})});var L=y(T,2);w(L,()=>b.MeshStandardMaterial,(x,S)=>{S(x,{color:_})}),G(p,E)},$$slots:{default:!0}})})}var De=y(he,2);{let R=J(()=>[-e.dimX/2-l/2,e.dimY/2,0]);w(De,()=>b.Mesh,(F,A)=>{A(F,{get position(){return v(R)},rotation:[0,0,Math.PI/2],onclick:p=>C(p,e.onAdjustX,-1),onpointerdown:p=>h(e.onAdjustX,"x",p),children:(p,te)=>{var E=to(),T=ie(E);w(T,()=>b.CylinderGeometry,(x,S)=>{S(x,{args:[c,c,l,8]})});var L=y(T,2);w(L,()=>b.MeshStandardMaterial,(x,S)=>{S(x,{color:_})}),G(p,E)},$$slots:{default:!0}})})}var ue=y(De,2);{let R=J(()=>[-e.dimX/2-l-g/2,e.dimY/2,0]);w(ue,()=>b.Mesh,(F,A)=>{A(F,{get position(){return v(R)},rotation:[0,0,Math.PI/2],onclick:p=>C(p,e.onAdjustX,-1),onpointerdown:p=>h(e.onAdjustX,"x",p),children:(p,te)=>{var E=no(),T=ie(E);w(T,()=>b.ConeGeometry,(x,S)=>{S(x,{args:[m,g,8]})});var L=y(T,2);w(L,()=>b.MeshStandardMaterial,(x,S)=>{S(x,{color:_})}),G(p,E)},$$slots:{default:!0}})})}var _e=y(ue,2);{let R=J(()=>[0,e.dimY+l/2,0]);w(_e,()=>b.Mesh,(F,A)=>{A(F,{get position(){return v(R)},onclick:p=>C(p,e.onAdjustY,1),onpointerdown:p=>h(e.onAdjustY,"y",p),children:(p,te)=>{var E=io(),T=ie(E);w(T,()=>b.CylinderGeometry,(x,S)=>{S(x,{args:[c,c,l,8]})});var L=y(T,2);w(L,()=>b.MeshStandardMaterial,(x,S)=>{S(x,{color:_})}),G(p,E)},$$slots:{default:!0}})})}var ye=y(_e,2);{let R=J(()=>[0,e.dimY+l+g/2,0]);w(ye,()=>b.Mesh,(F,A)=>{A(F,{get position(){return v(R)},onclick:p=>C(p,e.onAdjustY,1),onpointerdown:p=>h(e.onAdjustY,"y",p),children:(p,te)=>{var E=oo(),T=ie(E);w(T,()=>b.ConeGeometry,(x,S)=>{S(x,{args:[m,g,8]})});var L=y(T,2);w(L,()=>b.MeshStandardMaterial,(x,S)=>{S(x,{color:_})}),G(p,E)},$$slots:{default:!0}})})}var ae=y(ye,2);w(ae,()=>b.Mesh,(R,F)=>{F(R,{position:[0,-l/2,0],rotation:[0,0,Math.PI],onclick:A=>C(A,e.onAdjustY,-1),onpointerdown:A=>h(e.onAdjustY,"y",A),children:(A,p)=>{var te=ro(),E=ie(te);w(E,()=>b.CylinderGeometry,(L,x)=>{x(L,{args:[c,c,l,8]})});var T=y(E,2);w(T,()=>b.MeshStandardMaterial,(L,x)=>{x(L,{color:_})}),G(A,te)},$$slots:{default:!0}})});var se=y(ae,2);w(se,()=>b.Mesh,(R,F)=>{F(R,{position:[0,-l-g/2,0],rotation:[0,0,Math.PI],onclick:A=>C(A,e.onAdjustY,-1),onpointerdown:A=>h(e.onAdjustY,"y",A),children:(A,p)=>{var te=ao(),E=ie(te);w(E,()=>b.ConeGeometry,(L,x)=>{x(L,{args:[m,g,8]})});var T=y(E,2);w(T,()=>b.MeshStandardMaterial,(L,x)=>{x(L,{color:_})}),G(A,te)},$$slots:{default:!0}})});var ve=y(se,2);{let R=J(()=>[0,e.dimY/2,e.dimZ/2+l/2]);w(ve,()=>b.Mesh,(F,A)=>{A(F,{get position(){return v(R)},rotation:[Math.PI/2,0,0],onclick:p=>C(p,e.onAdjustZ,1),onpointerdown:p=>h(e.onAdjustZ,"x",p),children:(p,te)=>{var E=so(),T=ie(E);w(T,()=>b.CylinderGeometry,(x,S)=>{S(x,{args:[c,c,l,8]})});var L=y(T,2);w(L,()=>b.MeshStandardMaterial,(x,S)=>{S(x,{color:_})}),G(p,E)},$$slots:{default:!0}})})}var Ce=y(ve,2);{let R=J(()=>[0,e.dimY/2,e.dimZ/2+l+g/2]);w(Ce,()=>b.Mesh,(F,A)=>{A(F,{get position(){return v(R)},rotation:[Math.PI/2,0,0],onclick:p=>C(p,e.onAdjustZ,1),onpointerdown:p=>h(e.onAdjustZ,"x",p),children:(p,te)=>{var E=lo(),T=ie(E);w(T,()=>b.ConeGeometry,(x,S)=>{S(x,{args:[m,g,8]})});var L=y(T,2);w(L,()=>b.MeshStandardMaterial,(x,S)=>{S(x,{color:_})}),G(p,E)},$$slots:{default:!0}})})}var ke=y(Ce,2);{let R=J(()=>[0,e.dimY/2,-e.dimZ/2-l/2]);w(ke,()=>b.Mesh,(F,A)=>{A(F,{get position(){return v(R)},rotation:[-Math.PI/2,0,0],onclick:p=>C(p,e.onAdjustZ,-1),onpointerdown:p=>h(e.onAdjustZ,"x",p),children:(p,te)=>{var E=co(),T=ie(E);w(T,()=>b.CylinderGeometry,(x,S)=>{S(x,{args:[c,c,l,8]})});var L=y(T,2);w(L,()=>b.MeshStandardMaterial,(x,S)=>{S(x,{color:_})}),G(p,E)},$$slots:{default:!0}})})}var ze=y(ke,2);{let R=J(()=>[0,e.dimY/2,-e.dimZ/2-l-g/2]);w(ze,()=>b.Mesh,(F,A)=>{A(F,{get position(){return v(R)},rotation:[-Math.PI/2,0,0],onclick:p=>C(p,e.onAdjustZ,-1),onpointerdown:p=>h(e.onAdjustZ,"x",p),children:(p,te)=>{var E=ho(),T=ie(E);w(T,()=>b.ConeGeometry,(x,S)=>{S(x,{args:[m,g,8]})});var L=y(T,2);w(L,()=>b.MeshStandardMaterial,(x,S)=>{S(x,{color:_})}),G(p,E)},$$slots:{default:!0}})})}G(z,Y)};dt(Le,z=>{v(n)&&z(Ne)})}G(t,ee),vt()}class vo{parse(e,n={}){n=Object.assign({binary:!1},n);const i=n.binary,o=[];let r=0;e.traverse(function(d){if(d.isMesh){const f=d.geometry,u=f.index,h=f.getAttribute("position");r+=u!==null?u.count/3:h.count/3,o.push({object3d:d,geometry:f})}});let a,s=80;if(i===!0){const d=r*2+r*3*4*4+80+4,f=new ArrayBuffer(d);a=new DataView(f),a.setUint32(s,r,!0),s+=4}else a="",a+=`solid exported
`;const c=new I,l=new I,m=new I,g=new I,_=new I,O=new I;for(let d=0,f=o.length;d<f;d++){const u=o[d].object3d,h=o[d].geometry,P=h.index,Z=h.getAttribute("position");if(P!==null)for(let C=0;C<P.count;C+=3){const ee=P.getX(C+0),K=P.getX(C+1),ne=P.getX(C+2);M(ee,K,ne,Z,u)}else for(let C=0;C<Z.count;C+=3){const ee=C+0,K=C+1,ne=C+2;M(ee,K,ne,Z,u)}}return i===!1&&(a+=`endsolid exported
`),a;function M(d,f,u,h,P){c.fromBufferAttribute(h,d),l.fromBufferAttribute(h,f),m.fromBufferAttribute(h,u),P.isSkinnedMesh===!0&&(P.applyBoneTransform(d,c),P.applyBoneTransform(f,l),P.applyBoneTransform(u,m)),c.applyMatrix4(P.matrixWorld),l.applyMatrix4(P.matrixWorld),m.applyMatrix4(P.matrixWorld),W(c,l,m),$(c),$(l),$(m),i===!0?(a.setUint16(s,0,!0),s+=2):(a+=`		endloop
`,a+=`	endfacet
`)}function W(d,f,u){g.subVectors(u,f),_.subVectors(d,f),g.cross(_).normalize(),O.copy(g).normalize(),i===!0?(a.setFloat32(s,O.x,!0),s+=4,a.setFloat32(s,O.y,!0),s+=4,a.setFloat32(s,O.z,!0),s+=4):(a+="	facet normal "+O.x+" "+O.y+" "+O.z+`
`,a+=`		outer loop
`)}function $(d){i===!0?(a.setFloat32(s,d.x,!0),s+=4,a.setFloat32(s,d.y,!0),s+=4,a.setFloat32(s,d.z,!0),s+=4):a+="			vertex "+d.x+" "+d.y+" "+d.z+`
`}}}var mo=V("<button> </button>"),_o=V('<button class="ml-3 underline opacity-70 hover:opacity-100">Dismiss</button>'),yo=V("<div> <!></div>"),go=V('<div class="flex flex-col gap-6 w-full"><div class="flex flex-wrap items-center gap-6"><div class="flex items-center gap-3"><span class="text-sm font-medium text-gray-400">Units:</span> <div class="flex rounded-lg overflow-hidden border border-gray-600"><button>mm</button> <button>in</button></div></div> <div class="flex items-center gap-3"><span class="text-sm font-medium text-gray-400"> </span> <div class="flex rounded-lg overflow-hidden border border-gray-600"></div></div> <div class="flex items-center gap-3 ml-auto"><button class="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors" title="Export 3D model as STL file"><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg> Download</button> <button class="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors" title="Upload STL, metadata and preview to Nextcloud"><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd"></path></svg> </button></div></div> <!> <div class="flex flex-wrap gap-4 text-xs font-mono text-gray-500"><span> </span> <span>|</span> <span> </span></div> <div class="relative w-full rounded-xl overflow-hidden border border-gray-700" style="height: 480px;"><!> <div class="absolute bottom-4 left-4 z-10 bg-gray-900/80 backdrop-blur-sm rounded-xl p-3 border border-gray-700 select-none"><p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Adjust</p> <div class="flex flex-col gap-2"><div class="flex items-center gap-2"><span class="w-20 text-xs text-gray-300">Width (X)</span> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Decrease width">←</button> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Increase width">→</button></div> <div class="flex items-center gap-2"><span class="w-20 text-xs text-gray-300">Height (Y)</span> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Decrease height">↓</button> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Increase height">↑</button></div> <div class="flex items-center gap-2"><span class="w-20 text-xs text-gray-300">Length (Z)</span> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Decrease length">←</button> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Increase length">→</button></div></div></div> <div class="absolute bottom-4 right-4 z-10 bg-gray-900/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-700"><p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Dimensions</p> <div class="flex flex-col gap-1 font-mono text-sm"><div class="flex gap-3"><span class="text-gray-500 w-4">W</span> <span class="text-green-400"> </span></div> <div class="flex gap-3"><span class="text-gray-500 w-4">L</span> <span class="text-green-400"> </span></div> <div class="flex gap-3"><span class="text-gray-500 w-4">H</span> <span class="text-green-400"> </span></div></div></div></div></div>');function Ao(t,e){pt(e,!0);let n=Ve(e,"nextcloudServer",3,""),i=Ve(e,"cncUser",3,""),o=Ve(e,"cncPassword",3,"");const r=1/25,a=1/25.4,s=[.1,1,2.5,5,10],c=[.004,.04,.1,.5,1].map(D=>D*25.4),l=1,m=.1*25.4,g=100,_=950,O=100,M=1200,W=10,$=150;let d=we(310),f=we(405),u=we(120),h=we("mm"),P=we(1),Z=we("idle"),C=we("");const ee={idle:"",uploading:"bg-blue-900/40 border-blue-700 text-blue-300",success:"bg-green-900/40 border-green-700 text-green-300",error:"bg-red-900/40 border-red-700 text-red-300"};let K=J(()=>ee[v(Z)]),ne=J(()=>v(d)*r),re=J(()=>v(u)*r),Se=J(()=>v(f)*r);function de(D){return v(h)==="in"?(D*a).toFixed(3):D.toFixed(1)}function Oe(D,U,j){return Math.max(U,Math.min(j,D))}function Le(D){X(d,Oe(v(d)+v(P)*D,g,_),!0)}function Ne(D){X(u,Oe(v(u)+v(P)*D,W,$),!0)}function z(D){X(f,Oe(v(f)+v(P)*D,O,M),!0)}function Y(){const D=new $n(v(d),v(u),v(f)),U=new tn(D);return new vo().parse(U,{binary:!0})}function q(){const D=Y(),U=new Blob([D.buffer],{type:"application/octet-stream"}),j=URL.createObjectURL(U),le=document.createElement("a");le.href=j,le.download="model.stl",document.body.appendChild(le),le.click(),document.body.removeChild(le),URL.revokeObjectURL(j)}function he(){return new Promise(D=>{const U=document.querySelector("canvas");if(!U){D(null);return}U.toBlob(j=>D(j),"image/png")})}async function De(D,U){const j=await fetch(D,{method:"MKCOL",headers:{Authorization:U}});if(!j.ok&&j.status!==405)throw new Error(`MKCOL ${D} → ${j.status} ${j.statusText}`)}async function ue(D,U,j,le){const fe=await fetch(D,{method:"PUT",headers:{Authorization:j,"Content-Type":le},body:U});if(!fe.ok)throw new Error(`PUT ${D} → ${fe.status} ${fe.statusText}`)}async function _e(){if(!n()||!i()||!o()){X(Z,"error"),X(C,"Nextcloud credentials are not configured (NEXTCLOUD_WEBDAV_SERVER, CNC_APP_USER, CNC_APP_PASSWORD).");return}X(Z,"uploading"),X(C,"Uploading to Nextcloud…");try{let D=localStorage.getItem("oakpine_user_id");D||(D="USER_"+Date.now(),localStorage.setItem("oakpine_user_id",D));const U="Project_"+crypto.randomUUID(),j="Basic "+btoa(`${i()}:${o()}`),fe=`${n().replace(/\/$/,"")+"/remote.php/dav/files/"+i()}/CNC-Projects`,Me=`${fe}/${D}`,xe=`${Me}/${U}`;await De(fe,j),await De(Me,j),await De(xe,j);const at=Y();await ue(`${xe}/model.stl`,at.buffer,j,"application/octet-stream");const st={created_at:new Date().toISOString(),dimensions:{width_mm:v(d),length_mm:v(f),height_mm:v(u)},limits:{min:{width_mm:g,length_mm:O,height_mm:W},max:{width_mm:_,length_mm:M,height_mm:$}},unit:v(h)};await ue(`${xe}/metadata.json`,JSON.stringify(st,null,2),j,"application/json");const Rt=await he();Rt&&await ue(`${xe}/preview.png`,Rt,j,"image/png"),X(Z,"success"),X(C,`Uploaded to /CNC-Projects/${D}/${U}`)}catch(D){X(Z,"error"),X(C,D instanceof Error?D.message:"Upload failed",!0)}}var ye=go(),ae=H(ye),se=H(ae),ve=y(H(se),2),Ce=H(ve),ke=y(Ce,2);N(ve),N(se);var ze=y(se,2),R=H(ze),F=H(R);N(R);var A=y(R,2);Sn(A,21,()=>v(h)==="mm"?s:c,Pn,(D,U)=>{var j=mo(),le=H(j,!0);N(j),lt(fe=>{Be(j,1,`px-3 py-1.5 text-sm font-semibold transition-colors ${v(P)===v(U)?"bg-green-500 text-white":"bg-gray-800 text-gray-400 hover:text-white"}`),be(le,fe)},[()=>de(v(U))]),pe("click",j,()=>X(P,v(U),!0)),G(D,j)}),N(A),N(ze);var p=y(ze,2),te=H(p),E=y(te,2),T=y(H(E));N(E),N(p),N(ae);var L=y(ae,2);{var x=D=>{var U=yo(),j=H(U),le=y(j);{var fe=Me=>{var xe=_o();pe("click",xe,()=>{X(Z,"idle"),X(C,"")}),G(Me,xe)};dt(le,Me=>{v(Z)!=="uploading"&&Me(fe)})}N(U),lt(()=>{Be(U,1,`rounded-lg px-4 py-3 text-sm font-medium border ${v(K)??""}`),be(j,`${v(C)??""} `)}),G(D,U)};dt(L,D=>{v(Z)!=="idle"&&D(x)})}var S=y(L,2),et=H(S),un=H(et);N(et);var Mt=y(et,4),fn=H(Mt);N(Mt),N(S);var St=y(S,2),Pt=H(St);Vn(Pt,{children:(D,U)=>{po(D,{get dimX(){return v(ne)},get dimY(){return v(re)},get dimZ(){return v(Se)},onAdjustX:Le,onAdjustY:Ne,onAdjustZ:z})},$$slots:{default:!0}});var tt=y(Pt,2),Et=y(H(tt),2),nt=H(Et),Ot=y(H(nt),2),pn=y(Ot,2);N(nt);var it=y(nt,2),Ct=y(H(it),2),vn=y(Ct,2);N(it);var Tt=y(it,2),At=y(H(Tt),2),mn=y(At,2);N(Tt),N(Et),N(tt);var It=y(tt,2),jt=y(H(It),2),ot=H(jt),Lt=y(H(ot),2),_n=H(Lt);N(Lt),N(ot);var rt=y(ot,2),Nt=y(H(rt),2),yn=H(Nt);N(Nt),N(rt);var kt=y(rt,2),zt=y(H(kt),2),gn=H(zt);N(zt),N(kt),N(jt),N(It),N(St),N(ye),lt((D,U,j,le,fe,Me,xe,at,st)=>{Be(Ce,1,`px-4 py-1.5 text-sm font-semibold transition-colors ${v(h)==="mm"?"bg-green-500 text-white":"bg-gray-800 text-gray-400 hover:text-white"}`),Be(ke,1,`px-4 py-1.5 text-sm font-semibold transition-colors ${v(h)==="in"?"bg-green-500 text-white":"bg-gray-800 text-gray-400 hover:text-white"}`),be(F,`Step (${v(h)??""}):`),E.disabled=v(Z)==="uploading",be(T,` ${v(Z)==="uploading"?"Uploading…":"Manufacture"}`),be(un,`Min: ${D??""} × ${U??""} × ${j??""} ${v(h)??""}  (W × L × H)`),be(fn,`Max: ${le??""} × ${fe??""} × ${Me??""} ${v(h)??""}  (W × L × H)`),be(_n,`${xe??""} ${v(h)??""}`),be(yn,`${at??""} ${v(h)??""}`),be(gn,`${st??""} ${v(h)??""}`)},[()=>de(g),()=>de(O),()=>de(W),()=>de(_),()=>de(M),()=>de($),()=>de(v(d)),()=>de(v(f)),()=>de(v(u))]),pe("click",Ce,()=>{X(h,"mm"),X(P,l)}),pe("click",ke,()=>{X(h,"in"),X(P,m)}),pe("click",te,q),pe("click",E,_e),pe("click",Ot,()=>Le(-1)),pe("click",pn,()=>Le(1)),pe("click",Ct,()=>Ne(-1)),pe("click",vn,()=>Ne(1)),pe("click",At,()=>z(-1)),pe("click",mn,()=>z(1)),G(t,ye),vt()}Mn(["click"]);export{Ao as default};
