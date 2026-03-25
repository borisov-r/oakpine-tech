import"./disclose-version.DsnmJJEf.js";import{o as gt,q as xt,p as qe,u as At,c as jt,f as V,v as kt,a as G,h as $e,w as Nt,s as v,g as D,j as _e,d as W,i as pe,x as B,t as at,e as Y,r as H}from"./template.DtZfKPYR.js";import{d as Rt,a as fe,s as ke}from"./render.BTq1sVAA.js";import{e as zt,i as Lt}from"./each.DbAPb_14.js";import{s as Xe}from"./class.3jyHBqXt.js";import{p as st,u as Ut,c as se,D as Ie,V as C,S as Qe,M as Me,R as Je,O as Ht,a as $,B as Ue,U as Le,b as Yt,d as Zt,e as Ae,L as Ft,C as Gt,f as De,T as be,Q as lt,g as ct,P as Xt,h as Bt,i as Wt,j as bt,k as wt,l as Vt,m as x,n as Kt,o as de,w as Dt,q as qt,r as $t,s as Qt,t as Jt,v as en,F as dt,x as tn,y as b,z as nn}from"./T.BgbqATyx.js";import{i as on}from"./if.Bnb4x8QM.js";import{s as rn}from"./snippet.2QqtCTMV.js";import{d as an,w as ht,p as sn,s as ln,a as cn,b as dn,r as hn}from"./props.LCskouTu.js";import"./branches.CNLIHHx7.js";function un(t,e){e&&gt(st,{...xt(st),[t]:e})}function fn(t,e,n){const i=Ut();if(!i)throw new Error("No user context store found, did you invoke this function outside of your main <Canvas> component?");return e?(i.update(o=>{if(t in o)return o;const r=typeof e=="function"?e():e;return o[t]=r,o}),i.current[t]):an(i,o=>o[t])}const me=t=>({subscribe:t.subscribe,get current(){return t.current}});let Ee=0;const et=se(!1),He=se(!1),tt=se(void 0),nt=se(0),it=se(0),Mt=se([]),ot=se(0),{onStart:pn,onLoad:vn,onError:mn}=Ie;Ie.onStart=(t,e,n)=>{pn?.(t,e,n),He.set(!0),tt.set(t),nt.set(e),it.set(n);const i=(e-Ee)/(n-Ee);ot.set(i),i===1&&et.set(!0)};Ie.onLoad=()=>{vn?.(),He.set(!1)};Ie.onError=t=>{mn?.(t),Mt.update(e=>[...e,t])};Ie.onProgress=(t,e,n)=>{e===n&&(Ee=n),He.set(!0),tt.set(t),nt.set(e),it.set(n);const i=(e-Ee)/(n-Ee)||1;ot.set(i),i===1&&et.set(!0)};me(He),me(tt),me(nt),me(it),me(Mt),me(ot),me(et);new C;new C;new C;new Qe;new Me;new Je;new C;new C;new Me;new C;new C;new Ht;new C;new C;new C;new $;const _n="Right",yn="Top",gn="Front",xn="Left",bn="Bottom",wn="Back";[_n,yn,gn,xn,bn,wn].map(t=>t.toLocaleLowerCase());new Ue;new C;Le.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new $(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};Yt.line={uniforms:Zt.merge([Le.common,Le.fog,Le.line]),vertexShader:`
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
		`};new Ae;new C;new C;new Ae;new Ae;new Ae;new C;new Me;new Ft;new C;new Ue;new Qe;new Ae;const ut={type:"change"},rt={type:"start"},St={type:"end"},Ne=new Je,ft=new Xt,Dn=Math.cos(70*Bt.DEG2RAD),F=new C,ie=2*Math.PI,T={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Be=1e-6;let Mn=class extends Gt{constructor(e,n=null){super(e,n),this.state=T.NONE,this.enabled=!0,this.target=new C,this.cursor=new C,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:De.ROTATE,MIDDLE:De.DOLLY,RIGHT:De.PAN},this.touches={ONE:be.ROTATE,TWO:be.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new C,this._lastQuaternion=new lt,this._lastTargetPosition=new C,this._quat=new lt().setFromUnitVectors(e.up,new C(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new ct,this._sphericalDelta=new ct,this._scale=1,this._panOffset=new C,this._rotateStart=new $,this._rotateEnd=new $,this._rotateDelta=new $,this._panStart=new $,this._panEnd=new $,this._panDelta=new $,this._dollyStart=new $,this._dollyEnd=new $,this._dollyDelta=new $,this._dollyDirection=new C,this._mouse=new $,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Pn.bind(this),this._onPointerDown=Sn.bind(this),this._onPointerUp=En.bind(this),this._onContextMenu=kn.bind(this),this._onMouseWheel=Tn.bind(this),this._onKeyDown=In.bind(this),this._onTouchStart=An.bind(this),this._onTouchMove=jn.bind(this),this._onMouseDown=On.bind(this),this._onMouseMove=Cn.bind(this),this._interceptControlDown=Nn.bind(this),this._interceptControlUp=Rn.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(ut),this.update(),this.state=T.NONE}update(e=null){const n=this.object.position;F.copy(n).sub(this.target),F.applyQuaternion(this._quat),this._spherical.setFromVector3(F),this.autoRotate&&this.state===T.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,o=this.maxAzimuthAngle;isFinite(i)&&isFinite(o)&&(i<-Math.PI?i+=ie:i>Math.PI&&(i-=ie),o<-Math.PI?o+=ie:o>Math.PI&&(o-=ie),i<=o?this._spherical.theta=Math.max(i,Math.min(o,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+o)/2?Math.max(i,this._spherical.theta):Math.min(o,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(F.setFromSpherical(this._spherical),F.applyQuaternion(this._quatInverse),n.copy(this.target).add(F),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const s=F.length();a=this._clampDistance(s*this._scale);const c=s-a;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){const s=new C(this._mouse.x,this._mouse.y,0);s.unproject(this.object);const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;const l=new C(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(s),this.object.updateMatrixWorld(),a=F.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Ne.origin.copy(this.object.position),Ne.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Ne.direction))<Dn?this.object.lookAt(this.target):(ft.setFromNormalAndCoplanarPoint(this.object.up,this.target),Ne.intersectPlane(ft,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Be||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Be||this._lastTargetPosition.distanceToSquared(this.target)>Be?(this.dispatchEvent(ut),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?ie/60*this.autoRotateSpeed*e:ie/60/60*this.autoRotateSpeed}_getZoomScale(e){const n=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*n)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,n){F.setFromMatrixColumn(n,0),F.multiplyScalar(-e),this._panOffset.add(F)}_panUp(e,n){this.screenSpacePanning===!0?F.setFromMatrixColumn(n,1):(F.setFromMatrixColumn(n,0),F.crossVectors(this.object.up,F)),F.multiplyScalar(e),this._panOffset.add(F)}_pan(e,n){const i=this.domElement;if(this.object.isPerspectiveCamera){const o=this.object.position;F.copy(o).sub(this.target);let r=F.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/i.clientHeight,this.object.matrix),this._panUp(2*n*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(n*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,n){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),o=e-i.left,r=n-i.top,a=i.width,s=i.height;this._mouse.x=o/a*2-1,this._mouse.y=-(r/s)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(ie*this._rotateDelta.x/n.clientHeight),this._rotateUp(ie*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let n=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(ie*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),n=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(-ie*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),n=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(ie*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),n=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(-ie*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),n=!0;break}n&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),o=.5*(e.pageY+n.y);this._rotateStart.set(i,o)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),o=.5*(e.pageY+n.y);this._panStart.set(i,o)}}_handleTouchStartDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,o=e.pageY-n.y,r=Math.sqrt(i*i+o*o);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),o=.5*(e.pageX+i.x),r=.5*(e.pageY+i.y);this._rotateEnd.set(o,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(ie*this._rotateDelta.x/n.clientHeight),this._rotateUp(ie*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),o=.5*(e.pageY+n.y);this._panEnd.set(i,o)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,o=e.pageY-n.y,r=Math.sqrt(i*i+o*o);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+n.x)*.5,s=(e.pageY+n.y)*.5;this._updateZoomParameters(a,s)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId){this._pointers.splice(n,1);return}}_isTrackingPointer(e){for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId)return!0;return!1}_trackPointer(e){let n=this._pointerPositions[e.pointerId];n===void 0&&(n=new $,this._pointerPositions[e.pointerId]=n),n.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const n=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[n]}_customWheelEvent(e){const n=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(n){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}};function Sn(t){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(t.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(t)&&(this._addPointer(t),t.pointerType==="touch"?this._onTouchStart(t):this._onMouseDown(t)))}function Pn(t){this.enabled!==!1&&(t.pointerType==="touch"?this._onTouchMove(t):this._onMouseMove(t))}function En(t){switch(this._removePointer(t),this._pointers.length){case 0:this.domElement.releasePointerCapture(t.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(St),this.state=T.NONE;break;case 1:const e=this._pointers[0],n=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:n.x,pageY:n.y});break}}function On(t){let e;switch(t.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case De.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(t),this.state=T.DOLLY;break;case De.ROTATE:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=T.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=T.ROTATE}break;case De.PAN:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=T.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=T.PAN}break;default:this.state=T.NONE}this.state!==T.NONE&&this.dispatchEvent(rt)}function Cn(t){switch(this.state){case T.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(t);break;case T.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(t);break;case T.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(t);break}}function Tn(t){this.enabled===!1||this.enableZoom===!1||this.state!==T.NONE||(t.preventDefault(),this.dispatchEvent(rt),this._handleMouseWheel(this._customWheelEvent(t)),this.dispatchEvent(St))}function In(t){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(t)}function An(t){switch(this._trackPointer(t),this._pointers.length){case 1:switch(this.touches.ONE){case be.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(t),this.state=T.TOUCH_ROTATE;break;case be.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(t),this.state=T.TOUCH_PAN;break;default:this.state=T.NONE}break;case 2:switch(this.touches.TWO){case be.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(t),this.state=T.TOUCH_DOLLY_PAN;break;case be.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(t),this.state=T.TOUCH_DOLLY_ROTATE;break;default:this.state=T.NONE}break;default:this.state=T.NONE}this.state!==T.NONE&&this.dispatchEvent(rt)}function jn(t){switch(this._trackPointer(t),this.state){case T.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(t),this.update();break;case T.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(t),this.update();break;case T.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(t),this.update();break;case T.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(t),this.update();break;default:this.state=T.NONE}}function kn(t){this.enabled!==!1&&t.preventDefault()}function Nn(t){t.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Rn(t){t.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const zn=()=>fn("threlte-controls",{orbitControls:ht(void 0),trackballControls:ht(void 0)});function Ln(t,e){qe(e,!0);const n=()=>cn(s,"$parent",i),[i,o]=dn();let r=sn(e,"ref",15),a=hn(e,["$$slots","$$events","$$legacy","ref","children"]);const s=Wt(),{dom:c,invalidate:l}=bt();if(!wt(n(),"Camera"))throw new Error("Parent missing: <OrbitControls> need to be a child of a <Camera>");const p=new Mn(n(),c),{orbitControls:y}=zn();Vt(()=>{p.update()},{running:()=>e.autoRotate??e.enableDamping??!1}),At(()=>{const f=O=>{l(),e.onchange?.(O)};return y.set(p),p.addEventListener("change",f),()=>{y.set(void 0),p.removeEventListener("change",f)}}),x(t,ln({get is(){return p}},()=>a,{get ref(){return r()},set ref(f){r(f)},children:(f,O)=>{var M=jt(),X=V(M);rn(X,()=>e.children??kt,()=>({ref:p})),G(f,M)},$$slots:{default:!0}})),$e(),o()}new Me;new Me;new Kt;`${de.logdepthbuf_pars_vertex}${de.fog_pars_vertex}${de.logdepthbuf_vertex}${de.fog_vertex}`;`${de.tonemapping_fragment}${de.colorspace_fragment}`;`${de.tonemapping_fragment}${de.colorspace_fragment}`;const Un=`

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
`,Hn=`

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
`,Yn=`
struct BVH {

	usampler2D index;
	sampler2D position;

	sampler2D bvhBounds;
	usampler2D bvhContents;

};
`,Zn=Yn,Fn=`
	${Un}
	${Hn}
`;`${Zn}${Fn}${de.tonemapping_fragment}${de.colorspace_fragment}`;new Ue;typeof window<"u"&&document.createElement("div");const Gn=t=>{const{camera:e}=bt();let n=t.current.clientWidth,i=t.current.clientHeight;const o=new ResizeObserver(([r])=>{n=r.contentRect.width,i=r.contentRect.height});return Dt(t,r=>(r&&o.observe(r),()=>{r&&o.unobserve(r)})),(r,a)=>{a.pointer.update(s=>(s.set(r.offsetX/n*2-1,-(r.offsetY/i)*2+1),s)),a.raycaster.setFromCamera(a.pointer.current,e.current)}},Pt=Symbol("interactivity-context"),Xn=()=>xt(Pt),Bn=t=>{const e=se(qt().dom),n={enabled:se(!0),pointer:se(new $),pointerOverTarget:se(!1),lastEvent:void 0,raycaster:new $t,initialClick:[0,0],initialHits:[],hovered:new Map,interactiveObjects:[],target:e,handlers:new WeakMap,compute:Gn(e),filter:t?.filter,addInteractiveObject:(i,o)=>{n.interactiveObjects.indexOf(i)>-1||(n.handlers.set(i,o),n.interactiveObjects.push(i))},removeInteractiveObject:i=>{const o=n.interactiveObjects.indexOf(i);n.interactiveObjects.splice(o,1),n.handlers.delete(i)}};return gt(Pt,n),n},Et=()=>{const t=Xn();if(!t)throw new Error("No interactivity context found. Did you forget to implement interactivity()?");return t},pt=["onclick","oncontextmenu","ondblclick","onwheel","onpointerup","onpointerdown","onpointerover","onpointerout","onpointerenter","onpointerleave","onpointermove","onpointermissed"],Wn=()=>{un("interactivity",t=>{if(!wt(t.ref,"Object3D")||!Object.entries(t.props).some(([o,r])=>r!==void 0&&pt.includes(o)))return;const{addInteractiveObject:n,removeInteractiveObject:i}=Et();return Qt.pre(()=>[t.ref],([o])=>(n(o,t.props),()=>{i(o)})),{pluginProps:pt}})};function vt(t){return`${(t.eventObject||t.object).uuid}|${t.index}|${t.instanceId}`}const mt=[["click",!1],["contextmenu",!1],["dblclick",!1],["wheel",!1],["pointerdown",!0],["pointerup",!0],["pointerleave",!0],["pointerenter",!0],["pointermove",!0],["pointercancel",!0]],Vn=t=>{const{handlers:e}=Et(),n=m=>{const _=m.offsetX-t.initialClick[0],h=m.offsetY-t.initialClick[1];return Math.round(Math.hypot(_,h))},i=m=>{if(t.hovered.size===0)return;const _=new Set;for(const h of m)_.add(vt(h));for(const[h,u]of t.hovered)if(!_.has(h)){const{eventObject:L}=u;t.hovered.delete(h);const re=e.get(L);if(re){const U={...u,intersections:m};re.onpointerout?.(U),re.onpointerleave?.(U)}}},o=()=>{if(!t.enabled.current)return[];const m=[],_=t.raycaster.intersectObjects(t.interactiveObjects,!0),h=t.filter===void 0?_:t.filter(_,t);for(const u of h){let L=u.object;for(;L;)e.has(L)&&m.push({...u,eventObject:L}),L=L.parent}return m},r=(m,_)=>{for(const h of _)e.get(h)?.onpointermissed?.(m)},a=()=>{t.pointerOverTarget.set(!1),i([])},s=()=>{t.pointerOverTarget.set(!0)},c=m=>{const _=m.type,h=_==="pointermove",u=_==="click"||_==="contextmenu"||_==="dblclick";t.compute(m,t);const L=o(),re=u?n(m):0;_==="pointerdown"&&(t.initialClick=[m.offsetX,m.offsetY],t.initialHits=L.map(J=>J.eventObject)),u&&L.length===0&&re<=2&&r(m,t.interactiveObjects),h&&i(L);let U=!1;e:for(const J of L){const K=e.get(J.eventObject);if(!K)continue;const ee={stopped:U,...J,intersections:L,stopPropagation(){if(U=!0,ee.stopped=!0,t.hovered.size>0&&Array.from(t.hovered.values()).some(q=>q.eventObject===J.eventObject)){const q=L.slice(0,L.indexOf(J));i([...q,J])}},camera:t.raycaster.camera,delta:re,nativeEvent:m,pointer:t.pointer.current,ray:t.raycaster.ray};if(h){if(K.onpointerover||K.onpointerenter||K.onpointerout||K.onpointerleave){const q=vt(ee),he=t.hovered.get(q);he?he.stopped&&ee.stopPropagation():(t.hovered.set(q,ee),K.onpointerover?.(ee),K.onpointerenter?.(ee))}K.onpointermove?.(ee)}else K[`on${_}`]?(!u||t.initialHits.includes(J.eventObject))&&(r(m,t.interactiveObjects.filter(q=>!t.initialHits.includes(q))),K[`on${_}`]?.(ee)):u&&t.initialHits.includes(J.eventObject)&&r(m,t.interactiveObjects.filter(q=>!t.initialHits.includes(q)));if(U)break e}};let l=0,p=null,y=-1/0,f=-1/0;const O=.25,M=m=>{Math.abs(m.offsetX-y)<O&&Math.abs(m.offsetY-f)<O||(y=m.offsetX,f=m.offsetY,p=m,l||(l=requestAnimationFrame(()=>{l=0,p&&(c(p),p=null)})))},X=m=>{for(const[_]of mt)_==="pointerleave"||_==="pointercancel"?m.removeEventListener(_,a):_==="pointermove"?m.removeEventListener(_,M):_==="pointerenter"?m.removeEventListener(_,s):m.removeEventListener(_,c)},Q=m=>{for(const[_,h]of mt)_==="pointerleave"||_==="pointercancel"?m.addEventListener(_,a,{passive:h}):_==="pointermove"?m.addEventListener(_,M,{passive:h}):_==="pointerenter"?m.addEventListener(_,s,{passive:h}):m.addEventListener(_,c,{passive:h})};Dt(t.target,m=>(m&&Q(m),()=>{m&&X(m)}))},Kn=t=>{const e=Bn(t);return Wn(),Vn(e),e};for(let t=0;t<256;t++)(t<16?"0":"")+t.toString(16);new Jt(-1,1,1,-1,0,1);class qn extends en{constructor(){super(),this.setAttribute("position",new dt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new dt([0,2,0,0,2,0],2))}}new qn;var Ot={exports:{}};Ot.exports=Ye;Ot.exports.default=Ye;function Ye(t,e,n){n=n||2;var i=e&&e.length,o=i?e[0]*n:t.length,r=Ct(t,0,o,n,!0),a=[];if(!r||r.next===r.prev)return a;var s,c,l,p,y,f,O;if(i&&(r=ti(t,e,r,n)),t.length>80*n){s=l=t[0],c=p=t[1];for(var M=n;M<o;M+=n)y=t[M],f=t[M+1],y<s&&(s=y),f<c&&(c=f),y>l&&(l=y),f>p&&(p=f);O=Math.max(l-s,p-c),O=O!==0?32767/O:0}return Oe(r,a,n,s,c,O,0),a}function Ct(t,e,n,i,o){var r,a;if(o===Ke(t,e,n,i)>0)for(r=e;r<n;r+=i)a=_t(r,t[r],t[r+1],a);else for(r=n-i;r>=e;r-=i)a=_t(r,t[r],t[r+1],a);return a&&Ze(a,a.next)&&(Te(a),a=a.next),a}function ye(t,e){if(!t)return t;e||(e=t);var n=t,i;do if(i=!1,!n.steiner&&(Ze(n,n.next)||z(n.prev,n,n.next)===0)){if(Te(n),n=e=n.prev,n===n.next)break;i=!0}else n=n.next;while(i||n!==e);return e}function Oe(t,e,n,i,o,r,a){if(t){!a&&r&&ai(t,i,o,r);for(var s=t,c,l;t.prev!==t.next;){if(c=t.prev,l=t.next,r?Qn(t,i,o,r):$n(t)){e.push(c.i/n|0),e.push(t.i/n|0),e.push(l.i/n|0),Te(t),t=l.next,s=l.next;continue}if(t=l,t===s){a?a===1?(t=Jn(ye(t),e,n),Oe(t,e,n,i,o,r,2)):a===2&&ei(t,e,n,i,o,r):Oe(ye(t),e,n,i,o,r,1);break}}}}function $n(t){var e=t.prev,n=t,i=t.next;if(z(e,n,i)>=0)return!1;for(var o=e.x,r=n.x,a=i.x,s=e.y,c=n.y,l=i.y,p=o<r?o<a?o:a:r<a?r:a,y=s<c?s<l?s:l:c<l?c:l,f=o>r?o>a?o:a:r>a?r:a,O=s>c?s>l?s:l:c>l?c:l,M=i.next;M!==e;){if(M.x>=p&&M.x<=f&&M.y>=y&&M.y<=O&&we(o,s,r,c,a,l,M.x,M.y)&&z(M.prev,M,M.next)>=0)return!1;M=M.next}return!0}function Qn(t,e,n,i){var o=t.prev,r=t,a=t.next;if(z(o,r,a)>=0)return!1;for(var s=o.x,c=r.x,l=a.x,p=o.y,y=r.y,f=a.y,O=s<c?s<l?s:l:c<l?c:l,M=p<y?p<f?p:f:y<f?y:f,X=s>c?s>l?s:l:c>l?c:l,Q=p>y?p>f?p:f:y>f?y:f,m=We(O,M,e,n,i),_=We(X,Q,e,n,i),h=t.prevZ,u=t.nextZ;h&&h.z>=m&&u&&u.z<=_;){if(h.x>=O&&h.x<=X&&h.y>=M&&h.y<=Q&&h!==o&&h!==a&&we(s,p,c,y,l,f,h.x,h.y)&&z(h.prev,h,h.next)>=0||(h=h.prevZ,u.x>=O&&u.x<=X&&u.y>=M&&u.y<=Q&&u!==o&&u!==a&&we(s,p,c,y,l,f,u.x,u.y)&&z(u.prev,u,u.next)>=0))return!1;u=u.nextZ}for(;h&&h.z>=m;){if(h.x>=O&&h.x<=X&&h.y>=M&&h.y<=Q&&h!==o&&h!==a&&we(s,p,c,y,l,f,h.x,h.y)&&z(h.prev,h,h.next)>=0)return!1;h=h.prevZ}for(;u&&u.z<=_;){if(u.x>=O&&u.x<=X&&u.y>=M&&u.y<=Q&&u!==o&&u!==a&&we(s,p,c,y,l,f,u.x,u.y)&&z(u.prev,u,u.next)>=0)return!1;u=u.nextZ}return!0}function Jn(t,e,n){var i=t;do{var o=i.prev,r=i.next.next;!Ze(o,r)&&Tt(o,i,i.next,r)&&Ce(o,r)&&Ce(r,o)&&(e.push(o.i/n|0),e.push(i.i/n|0),e.push(r.i/n|0),Te(i),Te(i.next),i=t=r),i=i.next}while(i!==t);return ye(i)}function ei(t,e,n,i,o,r){var a=t;do{for(var s=a.next.next;s!==a.prev;){if(a.i!==s.i&&ci(a,s)){var c=It(a,s);a=ye(a,a.next),c=ye(c,c.next),Oe(a,e,n,i,o,r,0),Oe(c,e,n,i,o,r,0);return}s=s.next}a=a.next}while(a!==t)}function ti(t,e,n,i){var o=[],r,a,s,c,l;for(r=0,a=e.length;r<a;r++)s=e[r]*i,c=r<a-1?e[r+1]*i:t.length,l=Ct(t,s,c,i,!1),l===l.next&&(l.steiner=!0),o.push(li(l));for(o.sort(ni),r=0;r<o.length;r++)n=ii(o[r],n);return n}function ni(t,e){return t.x-e.x}function ii(t,e){var n=oi(t,e);if(!n)return e;var i=It(n,t);return ye(i,i.next),ye(n,n.next)}function oi(t,e){var n=e,i=t.x,o=t.y,r=-1/0,a;do{if(o<=n.y&&o>=n.next.y&&n.next.y!==n.y){var s=n.x+(o-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(s<=i&&s>r&&(r=s,a=n.x<n.next.x?n:n.next,s===i))return a}n=n.next}while(n!==e);if(!a)return null;var c=a,l=a.x,p=a.y,y=1/0,f;n=a;do i>=n.x&&n.x>=l&&i!==n.x&&we(o<p?i:r,o,l,p,o<p?r:i,o,n.x,n.y)&&(f=Math.abs(o-n.y)/(i-n.x),Ce(n,t)&&(f<y||f===y&&(n.x>a.x||n.x===a.x&&ri(a,n)))&&(a=n,y=f)),n=n.next;while(n!==c);return a}function ri(t,e){return z(t.prev,t,e.prev)<0&&z(e.next,t,t.next)<0}function ai(t,e,n,i){var o=t;do o.z===0&&(o.z=We(o.x,o.y,e,n,i)),o.prevZ=o.prev,o.nextZ=o.next,o=o.next;while(o!==t);o.prevZ.nextZ=null,o.prevZ=null,si(o)}function si(t){var e,n,i,o,r,a,s,c,l=1;do{for(n=t,t=null,r=null,a=0;n;){for(a++,i=n,s=0,e=0;e<l&&(s++,i=i.nextZ,!!i);e++);for(c=l;s>0||c>0&&i;)s!==0&&(c===0||!i||n.z<=i.z)?(o=n,n=n.nextZ,s--):(o=i,i=i.nextZ,c--),r?r.nextZ=o:t=o,o.prevZ=r,r=o;n=i}r.nextZ=null,l*=2}while(a>1);return t}function We(t,e,n,i,o){return t=(t-n)*o|0,e=(e-i)*o|0,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t|e<<1}function li(t){var e=t,n=t;do(e.x<n.x||e.x===n.x&&e.y<n.y)&&(n=e),e=e.next;while(e!==t);return n}function we(t,e,n,i,o,r,a,s){return(o-a)*(e-s)>=(t-a)*(r-s)&&(t-a)*(i-s)>=(n-a)*(e-s)&&(n-a)*(r-s)>=(o-a)*(i-s)}function ci(t,e){return t.next.i!==e.i&&t.prev.i!==e.i&&!di(t,e)&&(Ce(t,e)&&Ce(e,t)&&hi(t,e)&&(z(t.prev,t,e.prev)||z(t,e.prev,e))||Ze(t,e)&&z(t.prev,t,t.next)>0&&z(e.prev,e,e.next)>0)}function z(t,e,n){return(e.y-t.y)*(n.x-e.x)-(e.x-t.x)*(n.y-e.y)}function Ze(t,e){return t.x===e.x&&t.y===e.y}function Tt(t,e,n,i){var o=ze(z(t,e,n)),r=ze(z(t,e,i)),a=ze(z(n,i,t)),s=ze(z(n,i,e));return!!(o!==r&&a!==s||o===0&&Re(t,n,e)||r===0&&Re(t,i,e)||a===0&&Re(n,t,i)||s===0&&Re(n,e,i))}function Re(t,e,n){return e.x<=Math.max(t.x,n.x)&&e.x>=Math.min(t.x,n.x)&&e.y<=Math.max(t.y,n.y)&&e.y>=Math.min(t.y,n.y)}function ze(t){return t>0?1:t<0?-1:0}function di(t,e){var n=t;do{if(n.i!==t.i&&n.next.i!==t.i&&n.i!==e.i&&n.next.i!==e.i&&Tt(n,n.next,t,e))return!0;n=n.next}while(n!==t);return!1}function Ce(t,e){return z(t.prev,t,t.next)<0?z(t,e,t.next)>=0&&z(t,t.prev,e)>=0:z(t,e,t.prev)<0||z(t,t.next,e)<0}function hi(t,e){var n=t,i=!1,o=(t.x+e.x)/2,r=(t.y+e.y)/2;do n.y>r!=n.next.y>r&&n.next.y!==n.y&&o<(n.next.x-n.x)*(r-n.y)/(n.next.y-n.y)+n.x&&(i=!i),n=n.next;while(n!==t);return i}function It(t,e){var n=new Ve(t.i,t.x,t.y),i=new Ve(e.i,e.x,e.y),o=t.next,r=e.prev;return t.next=e,e.prev=t,n.next=o,o.prev=n,i.next=n,n.prev=i,r.next=i,i.prev=r,i}function _t(t,e,n,i){var o=new Ve(t,e,n);return i?(o.next=i.next,o.prev=i,i.next.prev=o,i.next=o):(o.prev=o,o.next=o),o}function Te(t){t.next.prev=t.prev,t.prev.next=t.next,t.prevZ&&(t.prevZ.nextZ=t.nextZ),t.nextZ&&(t.nextZ.prevZ=t.prevZ)}function Ve(t,e,n){this.i=t,this.x=e,this.y=n,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}Ye.deviation=function(t,e,n,i){var o=e&&e.length,r=o?e[0]*n:t.length,a=Math.abs(Ke(t,0,r,n));if(o)for(var s=0,c=e.length;s<c;s++){var l=e[s]*n,p=s<c-1?e[s+1]*n:t.length;a-=Math.abs(Ke(t,l,p,n))}var y=0;for(s=0;s<i.length;s+=3){var f=i[s]*n,O=i[s+1]*n,M=i[s+2]*n;y+=Math.abs((t[f]-t[M])*(t[O+1]-t[f+1])-(t[f]-t[O])*(t[M+1]-t[f+1]))}return a===0&&y===0?0:Math.abs((y-a)/a)};function Ke(t,e,n,i){for(var o=0,r=e,a=n-i;r<n;r+=i)o+=(t[a]-t[r])*(t[r+1]+t[a+1]),a=r;return o}Ye.flatten=function(t){for(var e=t[0][0].length,n={vertices:[],holes:[],dimensions:e},i=0,o=0;o<t.length;o++){for(var r=0;r<t[o].length;r++)for(var a=0;a<e;a++)n.vertices.push(t[o][r][a]);o>0&&(i+=t[o-1].length,n.holes.push(i))}return n};new $;new $;var yt;(t=>{function e(o){let r=o.slice();return r.sort(t.POINT_COMPARATOR),t.makeHullPresorted(r)}t.makeHull=e;function n(o){if(o.length<=1)return o.slice();let r=[];for(let s=0;s<o.length;s++){const c=o[s];for(;r.length>=2;){const l=r[r.length-1],p=r[r.length-2];if((l.x-p.x)*(c.y-p.y)>=(l.y-p.y)*(c.x-p.x))r.pop();else break}r.push(c)}r.pop();let a=[];for(let s=o.length-1;s>=0;s--){const c=o[s];for(;a.length>=2;){const l=a[a.length-1],p=a[a.length-2];if((l.x-p.x)*(c.y-p.y)>=(l.y-p.y)*(c.x-p.x))a.pop();else break}a.push(c)}return a.pop(),r.length==1&&a.length==1&&r[0].x==a[0].x&&r[0].y==a[0].y?r:r.concat(a)}t.makeHullPresorted=n;function i(o,r){return o.x<r.x?-1:o.x>r.x?1:o.y<r.y?-1:o.y>r.y?1:0}t.POINT_COMPARATOR=i})(yt||(yt={}));new tn;new C;new Me;new Je;new Qe;new Ue;new C;new C;var ui=W("<!> <!>",1),fi=W("<!> <!>",1),pi=W("<!> <!>",1),vi=W("<!> <!>",1),mi=W("<!> <!>",1),_i=W("<!> <!>",1),yi=W("<!> <!>",1),gi=W("<!> <!>",1),xi=W("<!> <!>",1),bi=W("<!> <!>",1),wi=W("<!> <!>",1),Di=W("<!> <!>",1),Mi=W("<!> <!>",1),Si=W("<!> <!>",1),Pi=W("<!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!>",1),Ei=W("<!> <!> <!> <!> <!> <!> <!>",1);function Oi(t,e){qe(e,!0),Kn();let n=_e(!1),i=_e(!0);const o=20,r=20,a="#374151",s="#1f2937",c=.04,l=.3,p=.12,y=.2,f="#facc15",O=20;let M=!1,X,Q="x",m=0,_=0,h=!1;function u(I,N,Z){Z.stopPropagation(),I&&(M=!0,X=I,Q=N,h=!1,_=0,m=N==="x"?Z.event?.clientX??0:Z.event?.clientY??0,pe(i,!1),document.addEventListener("pointermove",L),document.addEventListener("pointerup",re,{once:!0}))}function L(I){if(!M)return;const N=Q==="x"?I.clientX:I.clientY,Z=N-m;m=N;const te=Q==="y"?-Z:Z;for(_+=te;_>=O;)X?.(1),_-=O,h=!0;for(;_<=-O;)X?.(-1),_+=O,h=!0}function re(){M=!1,X=void 0,pe(i,!0),document.removeEventListener("pointermove",L)}function U(I,N,Z){if(h){h=!1;return}I.stopPropagation(),N?.(Z)}Nt(()=>()=>{document.removeEventListener("pointermove",L)});var J=Ei(),K=V(J);b(K,()=>x.PerspectiveCamera,(I,N)=>{N(I,{makeDefault:!0,position:[8,6,8],fov:45,children:(Z,te)=>{Ln(Z,{enableDamping:!0,dampingFactor:.05,get enabled(){return D(i)}})},$$slots:{default:!0}})});var ee=v(K,2);b(ee,()=>x.AmbientLight,(I,N)=>{N(I,{intensity:.5})});var q=v(ee,2);b(q,()=>x.DirectionalLight,(I,N)=>{N(I,{position:[5,10,5],intensity:1.2,castShadow:!0})});var he=v(q,2);b(he,()=>x.GridHelper,(I,N)=>{N(I,{args:[o,r,a,s],position:[0,0,0]})});var Se=v(he,2);{let I=B(()=>[0,e.dimY/2,0]);b(Se,()=>x.Mesh,(N,Z)=>{Z(N,{get position(){return D(I)},castShadow:!0,receiveShadow:!0,onclick:te=>{te.stopPropagation(),pe(n,!D(n))},children:(te,ve)=>{var le=ui(),ae=V(le);{let ne=B(()=>[e.dimX,e.dimY,e.dimZ]);b(ae,()=>x.BoxGeometry,(oe,ce)=>{ce(oe,{get args(){return D(ne)}})})}var ue=v(ae,2);{let ne=B(()=>D(n)?"#86efac":"#4ade80");b(ue,()=>x.MeshStandardMaterial,(oe,ce)=>{ce(oe,{get color(){return D(ne)},metalness:.3,roughness:.5})})}G(te,le)},$$slots:{default:!0}})})}var ge=v(Se,2);{let I=B(()=>[0,e.dimY/2,0]);b(ge,()=>x.Mesh,(N,Z)=>{Z(N,{get position(){return D(I)},children:(te,ve)=>{var le=fi(),ae=V(le);{let ne=B(()=>[e.dimX,e.dimY,e.dimZ]);b(ae,()=>x.BoxGeometry,(oe,ce)=>{ce(oe,{get args(){return D(ne)}})})}var ue=v(ae,2);b(ue,()=>x.MeshBasicMaterial,(ne,oe)=>{oe(ne,{color:"#166534",wireframe:!0})}),G(te,le)},$$slots:{default:!0}})})}var je=v(ge,2);{var Fe=I=>{var N=Pi(),Z=V(N);{let j=B(()=>[e.dimX/2+l/2,e.dimY/2,0]);b(Z,()=>x.Mesh,(k,E)=>{E(k,{get position(){return D(j)},rotation:[0,0,-Math.PI/2],onclick:d=>U(d,e.onAdjustX,1),onpointerdown:d=>u(e.onAdjustX,"x",d),children:(d,R)=>{var w=pi(),P=V(w);b(P,()=>x.CylinderGeometry,(g,S)=>{S(g,{args:[c,c,l,8]})});var A=v(P,2);b(A,()=>x.MeshStandardMaterial,(g,S)=>{S(g,{color:f})}),G(d,w)},$$slots:{default:!0}})})}var te=v(Z,2);{let j=B(()=>[e.dimX/2+l+y/2,e.dimY/2,0]);b(te,()=>x.Mesh,(k,E)=>{E(k,{get position(){return D(j)},rotation:[0,0,-Math.PI/2],onclick:d=>U(d,e.onAdjustX,1),onpointerdown:d=>u(e.onAdjustX,"x",d),children:(d,R)=>{var w=vi(),P=V(w);b(P,()=>x.ConeGeometry,(g,S)=>{S(g,{args:[p,y,8]})});var A=v(P,2);b(A,()=>x.MeshStandardMaterial,(g,S)=>{S(g,{color:f})}),G(d,w)},$$slots:{default:!0}})})}var ve=v(te,2);{let j=B(()=>[-e.dimX/2-l/2,e.dimY/2,0]);b(ve,()=>x.Mesh,(k,E)=>{E(k,{get position(){return D(j)},rotation:[0,0,Math.PI/2],onclick:d=>U(d,e.onAdjustX,-1),onpointerdown:d=>u(e.onAdjustX,"x",d),children:(d,R)=>{var w=mi(),P=V(w);b(P,()=>x.CylinderGeometry,(g,S)=>{S(g,{args:[c,c,l,8]})});var A=v(P,2);b(A,()=>x.MeshStandardMaterial,(g,S)=>{S(g,{color:f})}),G(d,w)},$$slots:{default:!0}})})}var le=v(ve,2);{let j=B(()=>[-e.dimX/2-l-y/2,e.dimY/2,0]);b(le,()=>x.Mesh,(k,E)=>{E(k,{get position(){return D(j)},rotation:[0,0,Math.PI/2],onclick:d=>U(d,e.onAdjustX,-1),onpointerdown:d=>u(e.onAdjustX,"x",d),children:(d,R)=>{var w=_i(),P=V(w);b(P,()=>x.ConeGeometry,(g,S)=>{S(g,{args:[p,y,8]})});var A=v(P,2);b(A,()=>x.MeshStandardMaterial,(g,S)=>{S(g,{color:f})}),G(d,w)},$$slots:{default:!0}})})}var ae=v(le,2);{let j=B(()=>[0,e.dimY+l/2,0]);b(ae,()=>x.Mesh,(k,E)=>{E(k,{get position(){return D(j)},onclick:d=>U(d,e.onAdjustY,1),onpointerdown:d=>u(e.onAdjustY,"y",d),children:(d,R)=>{var w=yi(),P=V(w);b(P,()=>x.CylinderGeometry,(g,S)=>{S(g,{args:[c,c,l,8]})});var A=v(P,2);b(A,()=>x.MeshStandardMaterial,(g,S)=>{S(g,{color:f})}),G(d,w)},$$slots:{default:!0}})})}var ue=v(ae,2);{let j=B(()=>[0,e.dimY+l+y/2,0]);b(ue,()=>x.Mesh,(k,E)=>{E(k,{get position(){return D(j)},onclick:d=>U(d,e.onAdjustY,1),onpointerdown:d=>u(e.onAdjustY,"y",d),children:(d,R)=>{var w=gi(),P=V(w);b(P,()=>x.ConeGeometry,(g,S)=>{S(g,{args:[p,y,8]})});var A=v(P,2);b(A,()=>x.MeshStandardMaterial,(g,S)=>{S(g,{color:f})}),G(d,w)},$$slots:{default:!0}})})}var ne=v(ue,2);b(ne,()=>x.Mesh,(j,k)=>{k(j,{position:[0,-l/2,0],rotation:[0,0,Math.PI],onclick:E=>U(E,e.onAdjustY,-1),onpointerdown:E=>u(e.onAdjustY,"y",E),children:(E,d)=>{var R=xi(),w=V(R);b(w,()=>x.CylinderGeometry,(A,g)=>{g(A,{args:[c,c,l,8]})});var P=v(w,2);b(P,()=>x.MeshStandardMaterial,(A,g)=>{g(A,{color:f})}),G(E,R)},$$slots:{default:!0}})});var oe=v(ne,2);b(oe,()=>x.Mesh,(j,k)=>{k(j,{position:[0,-l-y/2,0],rotation:[0,0,Math.PI],onclick:E=>U(E,e.onAdjustY,-1),onpointerdown:E=>u(e.onAdjustY,"y",E),children:(E,d)=>{var R=bi(),w=V(R);b(w,()=>x.ConeGeometry,(A,g)=>{g(A,{args:[p,y,8]})});var P=v(w,2);b(P,()=>x.MeshStandardMaterial,(A,g)=>{g(A,{color:f})}),G(E,R)},$$slots:{default:!0}})});var ce=v(oe,2);{let j=B(()=>[0,e.dimY/2,e.dimZ/2+l/2]);b(ce,()=>x.Mesh,(k,E)=>{E(k,{get position(){return D(j)},rotation:[Math.PI/2,0,0],onclick:d=>U(d,e.onAdjustZ,1),onpointerdown:d=>u(e.onAdjustZ,"x",d),children:(d,R)=>{var w=wi(),P=V(w);b(P,()=>x.CylinderGeometry,(g,S)=>{S(g,{args:[c,c,l,8]})});var A=v(P,2);b(A,()=>x.MeshStandardMaterial,(g,S)=>{S(g,{color:f})}),G(d,w)},$$slots:{default:!0}})})}var xe=v(ce,2);{let j=B(()=>[0,e.dimY/2,e.dimZ/2+l+y/2]);b(xe,()=>x.Mesh,(k,E)=>{E(k,{get position(){return D(j)},rotation:[Math.PI/2,0,0],onclick:d=>U(d,e.onAdjustZ,1),onpointerdown:d=>u(e.onAdjustZ,"x",d),children:(d,R)=>{var w=Di(),P=V(w);b(P,()=>x.ConeGeometry,(g,S)=>{S(g,{args:[p,y,8]})});var A=v(P,2);b(A,()=>x.MeshStandardMaterial,(g,S)=>{S(g,{color:f})}),G(d,w)},$$slots:{default:!0}})})}var Pe=v(xe,2);{let j=B(()=>[0,e.dimY/2,-e.dimZ/2-l/2]);b(Pe,()=>x.Mesh,(k,E)=>{E(k,{get position(){return D(j)},rotation:[-Math.PI/2,0,0],onclick:d=>U(d,e.onAdjustZ,-1),onpointerdown:d=>u(e.onAdjustZ,"x",d),children:(d,R)=>{var w=Mi(),P=V(w);b(P,()=>x.CylinderGeometry,(g,S)=>{S(g,{args:[c,c,l,8]})});var A=v(P,2);b(A,()=>x.MeshStandardMaterial,(g,S)=>{S(g,{color:f})}),G(d,w)},$$slots:{default:!0}})})}var Ge=v(Pe,2);{let j=B(()=>[0,e.dimY/2,-e.dimZ/2-l-y/2]);b(Ge,()=>x.Mesh,(k,E)=>{E(k,{get position(){return D(j)},rotation:[-Math.PI/2,0,0],onclick:d=>U(d,e.onAdjustZ,-1),onpointerdown:d=>u(e.onAdjustZ,"x",d),children:(d,R)=>{var w=Si(),P=V(w);b(P,()=>x.ConeGeometry,(g,S)=>{S(g,{args:[p,y,8]})});var A=v(P,2);b(A,()=>x.MeshStandardMaterial,(g,S)=>{S(g,{color:f})}),G(d,w)},$$slots:{default:!0}})})}G(I,N)};on(je,I=>{D(n)&&I(Fe)})}G(t,J),$e()}var Ci=W("<button> </button>"),Ti=W('<div class="flex flex-col gap-6 w-full"><div class="flex flex-wrap items-center gap-6"><div class="flex items-center gap-3"><span class="text-sm font-medium text-gray-400">Units:</span> <div class="flex rounded-lg overflow-hidden border border-gray-600"><button>mm</button> <button>in</button></div></div> <div class="flex items-center gap-3"><span class="text-sm font-medium text-gray-400">Step (mm):</span> <div class="flex rounded-lg overflow-hidden border border-gray-600"></div></div></div> <div class="relative w-full rounded-xl overflow-hidden border border-gray-700" style="height: 480px;"><!> <div class="absolute bottom-4 left-4 z-10 bg-gray-900/80 backdrop-blur-sm rounded-xl p-3 border border-gray-700 select-none"><p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Adjust</p> <div class="flex flex-col gap-2"><div class="flex items-center gap-2"><span class="w-20 text-xs text-gray-300">Width (X)</span> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Decrease width">←</button> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Increase width">→</button></div> <div class="flex items-center gap-2"><span class="w-20 text-xs text-gray-300">Height (Y)</span> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Decrease height">↓</button> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Increase height">↑</button></div> <div class="flex items-center gap-2"><span class="w-20 text-xs text-gray-300">Depth (Z)</span> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Decrease depth">←</button> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Increase depth">→</button></div></div></div> <div class="absolute bottom-4 right-4 z-10 bg-gray-900/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-700"><p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Dimensions</p> <div class="flex flex-col gap-1 font-mono text-sm"><div class="flex gap-3"><span class="text-gray-500 w-4">W</span> <span class="text-green-400"> </span></div> <div class="flex gap-3"><span class="text-gray-500 w-4">H</span> <span class="text-green-400"> </span></div> <div class="flex gap-3"><span class="text-gray-500 w-4">D</span> <span class="text-green-400"> </span></div></div></div></div></div>');function Zi(t,e){qe(e,!0);const n=1/25,i=1/25.4,o=[.1,1,2.5,5,10];let r=_e(100),a=_e(12),s=_e(150),c=_e("mm"),l=_e(.1),p=B(()=>D(r)*n),y=B(()=>D(a)*n),f=B(()=>D(s)*n);function O(d){return D(c)==="in"?(d*i).toFixed(3):d.toFixed(1)}function M(d,R,w){return Math.max(R,Math.min(w,d))}function X(d){pe(r,M(D(r)+D(l)*d,10,500),!0)}function Q(d){pe(a,M(D(a)+D(l)*d,1,200),!0)}function m(d){pe(s,M(D(s)+D(l)*d,10,500),!0)}var _=Ti(),h=Y(_),u=Y(h),L=v(Y(u),2),re=Y(L),U=v(re,2);H(L),H(u);var J=v(u,2),K=v(Y(J),2);zt(K,21,()=>o,Lt,(d,R)=>{var w=Ci(),P=Y(w,!0);H(w),at(()=>{Xe(w,1,`px-3 py-1.5 text-sm font-semibold transition-colors ${D(l)===D(R)?"bg-green-500 text-white":"bg-gray-800 text-gray-400 hover:text-white"}`),ke(P,D(R))}),fe("click",w,()=>pe(l,D(R),!0)),G(d,w)}),H(K),H(J),H(h);var ee=v(h,2),q=Y(ee);nn(q,{children:(d,R)=>{Oi(d,{get dimX(){return D(p)},get dimY(){return D(y)},get dimZ(){return D(f)},onAdjustX:X,onAdjustY:Q,onAdjustZ:m})},$$slots:{default:!0}});var he=v(q,2),Se=v(Y(he),2),ge=Y(Se),je=v(Y(ge),2),Fe=v(je,2);H(ge);var I=v(ge,2),N=v(Y(I),2),Z=v(N,2);H(I);var te=v(I,2),ve=v(Y(te),2),le=v(ve,2);H(te),H(Se),H(he);var ae=v(he,2),ue=v(Y(ae),2),ne=Y(ue),oe=v(Y(ne),2),ce=Y(oe);H(oe),H(ne);var xe=v(ne,2),Pe=v(Y(xe),2),Ge=Y(Pe);H(Pe),H(xe);var j=v(xe,2),k=v(Y(j),2),E=Y(k);H(k),H(j),H(ue),H(ae),H(ee),H(_),at((d,R,w)=>{Xe(re,1,`px-4 py-1.5 text-sm font-semibold transition-colors ${D(c)==="mm"?"bg-green-500 text-white":"bg-gray-800 text-gray-400 hover:text-white"}`),Xe(U,1,`px-4 py-1.5 text-sm font-semibold transition-colors ${D(c)==="in"?"bg-green-500 text-white":"bg-gray-800 text-gray-400 hover:text-white"}`),ke(ce,`${d??""} ${D(c)??""}`),ke(Ge,`${R??""} ${D(c)??""}`),ke(E,`${w??""} ${D(c)??""}`)},[()=>O(D(r)),()=>O(D(a)),()=>O(D(s))]),fe("click",re,()=>pe(c,"mm")),fe("click",U,()=>pe(c,"in")),fe("click",je,()=>X(-1)),fe("click",Fe,()=>X(1)),fe("click",N,()=>Q(-1)),fe("click",Z,()=>Q(1)),fe("click",ve,()=>m(-1)),fe("click",le,()=>m(1)),G(t,_),$e()}Rt(["click"]);export{Zi as default};
