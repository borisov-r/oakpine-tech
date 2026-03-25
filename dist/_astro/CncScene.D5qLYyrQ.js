import"./disclose-version.DsnmJJEf.js";import{p as wt,_ as Vt,h as Kt,i as ve,$ as Xt,a as oe,b as Dt,d as _,f as _e,g as d,a0 as U,t as qt,c as w,s as L,e as ue,r as D}from"./template.HAG7McSB.js";import{d as Qt,a as I,s as q}from"./render.DRbxpLoH.js";import{a as pt,s as P,b as Q,r as J}from"./attributes.C9fQanUh.js";import{u as Jt,c as W,D as ce,V as g,S as Fe,M as ne,R as Ze,O as ei,a as C,B as ye,U as xe,b as ti,d as ii,e as de,L as ni,C as oi,f as ie,T as ee,Q as ft,g as mt,P as ri,h as ai,i as si,j as li,k as ci,l as di,m as k,n as hi,o as F,p as ui,q as pi,F as vt,r as fi,s as j,t as mi}from"./T.EBuZOgTq.js";import{s as vi}from"./snippet.zmeixpxy.js";import{d as xi,w as xt,p as _i,s as yi,a as gi,b as bi,r as wi}from"./props.D_aN8LSX.js";import"./branches.CzBL5wmJ.js";import"./if.CxEwRzRs.js";function Di(t,e,i){const n=Jt();if(!n)throw new Error("No user context store found, did you invoke this function outside of your main <Canvas> component?");return e?(n.update(o=>{if(t in o)return o;const r=typeof e=="function"?e():e;return o[t]=r,o}),n.current[t]):xi(n,o=>o[t])}const $=t=>({subscribe:t.subscribe,get current(){return t.current}});let re=0;const He=W(!1),ge=W(!1),Ye=W(void 0),Be=W(0),$e=W(0),St=W([]),Ge=W(0),{onStart:Si,onLoad:Ei,onError:Pi}=ce;ce.onStart=(t,e,i)=>{Si?.(t,e,i),ge.set(!0),Ye.set(t),Be.set(e),$e.set(i);const n=(e-re)/(i-re);Ge.set(n),n===1&&He.set(!0)};ce.onLoad=()=>{Ei?.(),ge.set(!1)};ce.onError=t=>{Pi?.(t),St.update(e=>[...e,t])};ce.onProgress=(t,e,i)=>{e===i&&(re=i),ge.set(!0),Ye.set(t),Be.set(e),$e.set(i);const n=(e-re)/(i-re)||1;Ge.set(n),n===1&&He.set(!0)};$(ge),$(Ye),$(Be),$($e),$(St),$(Ge),$(He);new g;new g;new g;new Fe;new ne;new Ze;new g;new g;new ne;new g;new g;new ei;new g;new g;new g;new C;const Mi="Right",Ti="Top",Ci="Front",Oi="Left",Ii="Bottom",Ai="Back";[Mi,Ti,Ci,Oi,Ii,Ai].map(t=>t.toLocaleLowerCase());new ye;new g;xe.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new C(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};ti.line={uniforms:ii.merge([xe.common,xe.fog,xe.line]),vertexShader:`
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
		`};new de;new g;new g;new de;new de;new de;new g;new ne;new ni;new g;new ye;new Fe;new de;const _t={type:"change"},We={type:"start"},Et={type:"end"},pe=new Ze,yt=new ri,Ni=Math.cos(70*ai.DEG2RAD),E=new g,A=2*Math.PI,b={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Le=1e-6;let zi=class extends oi{constructor(e,i=null){super(e,i),this.state=b.NONE,this.enabled=!0,this.target=new g,this.cursor=new g,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:ie.ROTATE,MIDDLE:ie.DOLLY,RIGHT:ie.PAN},this.touches={ONE:ee.ROTATE,TWO:ee.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new g,this._lastQuaternion=new ft,this._lastTargetPosition=new g,this._quat=new ft().setFromUnitVectors(e.up,new g(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new mt,this._sphericalDelta=new mt,this._scale=1,this._panOffset=new g,this._rotateStart=new C,this._rotateEnd=new C,this._rotateDelta=new C,this._panStart=new C,this._panEnd=new C,this._panDelta=new C,this._dollyStart=new C,this._dollyEnd=new C,this._dollyDelta=new C,this._dollyDirection=new g,this._mouse=new C,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Li.bind(this),this._onPointerDown=Ri.bind(this),this._onPointerUp=ki.bind(this),this._onContextMenu=Bi.bind(this),this._onMouseWheel=Fi.bind(this),this._onKeyDown=Zi.bind(this),this._onTouchStart=Hi.bind(this),this._onTouchMove=Yi.bind(this),this._onMouseDown=ji.bind(this),this._onMouseMove=Ui.bind(this),this._interceptControlDown=$i.bind(this),this._interceptControlUp=Gi.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(_t),this.update(),this.state=b.NONE}update(e=null){const i=this.object.position;E.copy(i).sub(this.target),E.applyQuaternion(this._quat),this._spherical.setFromVector3(E),this.autoRotate&&this.state===b.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,o=this.maxAzimuthAngle;isFinite(n)&&isFinite(o)&&(n<-Math.PI?n+=A:n>Math.PI&&(n-=A),o<-Math.PI?o+=A:o>Math.PI&&(o-=A),n<=o?this._spherical.theta=Math.max(n,Math.min(o,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+o)/2?Math.max(n,this._spherical.theta):Math.min(o,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(E.setFromSpherical(this._spherical),E.applyQuaternion(this._quatInverse),i.copy(this.target).add(E),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const s=E.length();a=this._clampDistance(s*this._scale);const l=s-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const s=new g(this._mouse.x,this._mouse.y,0);s.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new g(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(s),this.object.updateMatrixWorld(),a=E.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(pe.origin.copy(this.object.position),pe.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(pe.direction))<Ni?this.object.lookAt(this.target):(yt.setFromNormalAndCoplanarPoint(this.object.up,this.target),pe.intersectPlane(yt,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Le||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Le||this._lastTargetPosition.distanceToSquared(this.target)>Le?(this.dispatchEvent(_t),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?A/60*this.autoRotateSpeed*e:A/60/60*this.autoRotateSpeed}_getZoomScale(e){const i=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*i)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,i){E.setFromMatrixColumn(i,0),E.multiplyScalar(-e),this._panOffset.add(E)}_panUp(e,i){this.screenSpacePanning===!0?E.setFromMatrixColumn(i,1):(E.setFromMatrixColumn(i,0),E.crossVectors(this.object.up,E)),E.multiplyScalar(e),this._panOffset.add(E)}_pan(e,i){const n=this.domElement;if(this.object.isPerspectiveCamera){const o=this.object.position;E.copy(o).sub(this.target);let r=E.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*i*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(i*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,i){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),o=e-n.left,r=i-n.top,a=n.width,s=n.height;this._mouse.x=o/a*2-1,this._mouse.y=-(r/s)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const i=this.domElement;this._rotateLeft(A*this._rotateDelta.x/i.clientHeight),this._rotateUp(A*this._rotateDelta.y/i.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let i=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(A*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),i=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(-A*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),i=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(A*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),i=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(-A*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),i=!0;break}i&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),n=.5*(e.pageX+i.x),o=.5*(e.pageY+i.y);this._rotateStart.set(n,o)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),n=.5*(e.pageX+i.x),o=.5*(e.pageY+i.y);this._panStart.set(n,o)}}_handleTouchStartDolly(e){const i=this._getSecondPointerPosition(e),n=e.pageX-i.x,o=e.pageY-i.y,r=Math.sqrt(n*n+o*o);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),o=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(o,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const i=this.domElement;this._rotateLeft(A*this._rotateDelta.x/i.clientHeight),this._rotateUp(A*this._rotateDelta.y/i.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),n=.5*(e.pageX+i.x),o=.5*(e.pageY+i.y);this._panEnd.set(n,o)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const i=this._getSecondPointerPosition(e),n=e.pageX-i.x,o=e.pageY-i.y,r=Math.sqrt(n*n+o*o);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+i.x)*.5,s=(e.pageY+i.y)*.5;this._updateZoomParameters(a,s)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let i=0;i<this._pointers.length;i++)if(this._pointers[i]==e.pointerId){this._pointers.splice(i,1);return}}_isTrackingPointer(e){for(let i=0;i<this._pointers.length;i++)if(this._pointers[i]==e.pointerId)return!0;return!1}_trackPointer(e){let i=this._pointerPositions[e.pointerId];i===void 0&&(i=new C,this._pointerPositions[e.pointerId]=i),i.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const i=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[i]}_customWheelEvent(e){const i=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(i){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function Ri(t){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(t.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(t)&&(this._addPointer(t),t.pointerType==="touch"?this._onTouchStart(t):this._onMouseDown(t)))}function Li(t){this.enabled!==!1&&(t.pointerType==="touch"?this._onTouchMove(t):this._onMouseMove(t))}function ki(t){switch(this._removePointer(t),this._pointers.length){case 0:this.domElement.releasePointerCapture(t.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Et),this.state=b.NONE;break;case 1:const e=this._pointers[0],i=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:i.x,pageY:i.y});break}}function ji(t){let e;switch(t.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case ie.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(t),this.state=b.DOLLY;break;case ie.ROTATE:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=b.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=b.ROTATE}break;case ie.PAN:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=b.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=b.PAN}break;default:this.state=b.NONE}this.state!==b.NONE&&this.dispatchEvent(We)}function Ui(t){switch(this.state){case b.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(t);break;case b.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(t);break;case b.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(t);break}}function Fi(t){this.enabled===!1||this.enableZoom===!1||this.state!==b.NONE||(t.preventDefault(),this.dispatchEvent(We),this._handleMouseWheel(this._customWheelEvent(t)),this.dispatchEvent(Et))}function Zi(t){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(t)}function Hi(t){switch(this._trackPointer(t),this._pointers.length){case 1:switch(this.touches.ONE){case ee.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(t),this.state=b.TOUCH_ROTATE;break;case ee.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(t),this.state=b.TOUCH_PAN;break;default:this.state=b.NONE}break;case 2:switch(this.touches.TWO){case ee.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(t),this.state=b.TOUCH_DOLLY_PAN;break;case ee.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(t),this.state=b.TOUCH_DOLLY_ROTATE;break;default:this.state=b.NONE}break;default:this.state=b.NONE}this.state!==b.NONE&&this.dispatchEvent(We)}function Yi(t){switch(this._trackPointer(t),this.state){case b.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(t),this.update();break;case b.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(t),this.update();break;case b.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(t),this.update();break;case b.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(t),this.update();break;default:this.state=b.NONE}}function Bi(t){this.enabled!==!1&&t.preventDefault()}function $i(t){t.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Gi(t){t.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const Wi=()=>Di("threlte-controls",{orbitControls:xt(void 0),trackballControls:xt(void 0)});function Vi(t,e){wt(e,!0);const i=()=>gi(s,"$parent",n),[n,o]=bi();let r=_i(e,"ref",15),a=wi(e,["$$slots","$$events","$$legacy","ref","children"]);const s=si(),{dom:l,invalidate:c}=li();if(!ci(i(),"Camera"))throw new Error("Parent missing: <OrbitControls> need to be a child of a <Camera>");const h=new zi(i(),l),{orbitControls:x}=Wi();di(()=>{h.update()},{running:()=>e.autoRotate??e.enableDamping??!1}),Vt(()=>{const p=m=>{c(),e.onchange?.(m)};return x.set(h),h.addEventListener("change",p),()=>{x.set(void 0),h.removeEventListener("change",p)}}),k(t,yi({get is(){return h}},()=>a,{get ref(){return r()},set ref(p){r(p)},children:(p,m)=>{var u=Kt(),M=ve(u);vi(M,()=>e.children??Xt,()=>({ref:h})),oe(p,u)},$$slots:{default:!0}})),Dt(),o()}new ne;new ne;new hi;`${F.logdepthbuf_pars_vertex}${F.fog_pars_vertex}${F.logdepthbuf_vertex}${F.fog_vertex}`;`${F.tonemapping_fragment}${F.colorspace_fragment}`;`${F.tonemapping_fragment}${F.colorspace_fragment}`;const Ki=`

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
`,Xi=`

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
`,qi=`
struct BVH {

	usampler2D index;
	sampler2D position;

	sampler2D bvhBounds;
	usampler2D bvhContents;

};
`,Qi=qi,Ji=`
	${Ki}
	${Xi}
`;`${Qi}${Ji}${F.tonemapping_fragment}${F.colorspace_fragment}`;new ye;typeof window<"u"&&document.createElement("div");for(let t=0;t<256;t++)(t<16?"0":"")+t.toString(16);new ui(-1,1,1,-1,0,1);class en extends pi{constructor(){super(),this.setAttribute("position",new vt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new vt([0,2,0,0,2,0],2))}}new en;var Pt={exports:{}};Pt.exports=be;Pt.exports.default=be;function be(t,e,i){i=i||2;var n=e&&e.length,o=n?e[0]*i:t.length,r=Mt(t,0,o,i,!0),a=[];if(!r||r.next===r.prev)return a;var s,l,c,h,x,p,m;if(n&&(r=an(t,e,r,i)),t.length>80*i){s=c=t[0],l=h=t[1];for(var u=i;u<o;u+=i)x=t[u],p=t[u+1],x<s&&(s=x),p<l&&(l=p),x>c&&(c=x),p>h&&(h=p);m=Math.max(c-s,h-l),m=m!==0?32767/m:0}return ae(r,a,i,s,l,m,0),a}function Mt(t,e,i,n,o){var r,a;if(o===Ue(t,e,i,n)>0)for(r=e;r<i;r+=n)a=gt(r,t[r],t[r+1],a);else for(r=i-n;r>=e;r-=n)a=gt(r,t[r],t[r+1],a);return a&&we(a,a.next)&&(le(a),a=a.next),a}function G(t,e){if(!t)return t;e||(e=t);var i=t,n;do if(n=!1,!i.steiner&&(we(i,i.next)||S(i.prev,i,i.next)===0)){if(le(i),i=e=i.prev,i===i.next)break;n=!0}else i=i.next;while(n||i!==e);return e}function ae(t,e,i,n,o,r,a){if(t){!a&&r&&hn(t,n,o,r);for(var s=t,l,c;t.prev!==t.next;){if(l=t.prev,c=t.next,r?nn(t,n,o,r):tn(t)){e.push(l.i/i|0),e.push(t.i/i|0),e.push(c.i/i|0),le(t),t=c.next,s=c.next;continue}if(t=c,t===s){a?a===1?(t=on(G(t),e,i),ae(t,e,i,n,o,r,2)):a===2&&rn(t,e,i,n,o,r):ae(G(t),e,i,n,o,r,1);break}}}}function tn(t){var e=t.prev,i=t,n=t.next;if(S(e,i,n)>=0)return!1;for(var o=e.x,r=i.x,a=n.x,s=e.y,l=i.y,c=n.y,h=o<r?o<a?o:a:r<a?r:a,x=s<l?s<c?s:c:l<c?l:c,p=o>r?o>a?o:a:r>a?r:a,m=s>l?s>c?s:c:l>c?l:c,u=n.next;u!==e;){if(u.x>=h&&u.x<=p&&u.y>=x&&u.y<=m&&te(o,s,r,l,a,c,u.x,u.y)&&S(u.prev,u,u.next)>=0)return!1;u=u.next}return!0}function nn(t,e,i,n){var o=t.prev,r=t,a=t.next;if(S(o,r,a)>=0)return!1;for(var s=o.x,l=r.x,c=a.x,h=o.y,x=r.y,p=a.y,m=s<l?s<c?s:c:l<c?l:c,u=h<x?h<p?h:p:x<p?x:p,M=s>l?s>c?s:c:l>c?l:c,N=h>x?h>p?h:p:x>p?x:p,z=ke(m,u,e,i,n),T=ke(M,N,e,i,n),f=t.prevZ,v=t.nextZ;f&&f.z>=z&&v&&v.z<=T;){if(f.x>=m&&f.x<=M&&f.y>=u&&f.y<=N&&f!==o&&f!==a&&te(s,h,l,x,c,p,f.x,f.y)&&S(f.prev,f,f.next)>=0||(f=f.prevZ,v.x>=m&&v.x<=M&&v.y>=u&&v.y<=N&&v!==o&&v!==a&&te(s,h,l,x,c,p,v.x,v.y)&&S(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;f&&f.z>=z;){if(f.x>=m&&f.x<=M&&f.y>=u&&f.y<=N&&f!==o&&f!==a&&te(s,h,l,x,c,p,f.x,f.y)&&S(f.prev,f,f.next)>=0)return!1;f=f.prevZ}for(;v&&v.z<=T;){if(v.x>=m&&v.x<=M&&v.y>=u&&v.y<=N&&v!==o&&v!==a&&te(s,h,l,x,c,p,v.x,v.y)&&S(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function on(t,e,i){var n=t;do{var o=n.prev,r=n.next.next;!we(o,r)&&Tt(o,n,n.next,r)&&se(o,r)&&se(r,o)&&(e.push(o.i/i|0),e.push(n.i/i|0),e.push(r.i/i|0),le(n),le(n.next),n=t=r),n=n.next}while(n!==t);return G(n)}function rn(t,e,i,n,o,r){var a=t;do{for(var s=a.next.next;s!==a.prev;){if(a.i!==s.i&&fn(a,s)){var l=Ct(a,s);a=G(a,a.next),l=G(l,l.next),ae(a,e,i,n,o,r,0),ae(l,e,i,n,o,r,0);return}s=s.next}a=a.next}while(a!==t)}function an(t,e,i,n){var o=[],r,a,s,l,c;for(r=0,a=e.length;r<a;r++)s=e[r]*n,l=r<a-1?e[r+1]*n:t.length,c=Mt(t,s,l,n,!1),c===c.next&&(c.steiner=!0),o.push(pn(c));for(o.sort(sn),r=0;r<o.length;r++)i=ln(o[r],i);return i}function sn(t,e){return t.x-e.x}function ln(t,e){var i=cn(t,e);if(!i)return e;var n=Ct(i,t);return G(n,n.next),G(i,i.next)}function cn(t,e){var i=e,n=t.x,o=t.y,r=-1/0,a;do{if(o<=i.y&&o>=i.next.y&&i.next.y!==i.y){var s=i.x+(o-i.y)*(i.next.x-i.x)/(i.next.y-i.y);if(s<=n&&s>r&&(r=s,a=i.x<i.next.x?i:i.next,s===n))return a}i=i.next}while(i!==e);if(!a)return null;var l=a,c=a.x,h=a.y,x=1/0,p;i=a;do n>=i.x&&i.x>=c&&n!==i.x&&te(o<h?n:r,o,c,h,o<h?r:n,o,i.x,i.y)&&(p=Math.abs(o-i.y)/(n-i.x),se(i,t)&&(p<x||p===x&&(i.x>a.x||i.x===a.x&&dn(a,i)))&&(a=i,x=p)),i=i.next;while(i!==l);return a}function dn(t,e){return S(t.prev,t,e.prev)<0&&S(e.next,t,t.next)<0}function hn(t,e,i,n){var o=t;do o.z===0&&(o.z=ke(o.x,o.y,e,i,n)),o.prevZ=o.prev,o.nextZ=o.next,o=o.next;while(o!==t);o.prevZ.nextZ=null,o.prevZ=null,un(o)}function un(t){var e,i,n,o,r,a,s,l,c=1;do{for(i=t,t=null,r=null,a=0;i;){for(a++,n=i,s=0,e=0;e<c&&(s++,n=n.nextZ,!!n);e++);for(l=c;s>0||l>0&&n;)s!==0&&(l===0||!n||i.z<=n.z)?(o=i,i=i.nextZ,s--):(o=n,n=n.nextZ,l--),r?r.nextZ=o:t=o,o.prevZ=r,r=o;i=n}r.nextZ=null,c*=2}while(a>1);return t}function ke(t,e,i,n,o){return t=(t-i)*o|0,e=(e-n)*o|0,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t|e<<1}function pn(t){var e=t,i=t;do(e.x<i.x||e.x===i.x&&e.y<i.y)&&(i=e),e=e.next;while(e!==t);return i}function te(t,e,i,n,o,r,a,s){return(o-a)*(e-s)>=(t-a)*(r-s)&&(t-a)*(n-s)>=(i-a)*(e-s)&&(i-a)*(r-s)>=(o-a)*(n-s)}function fn(t,e){return t.next.i!==e.i&&t.prev.i!==e.i&&!mn(t,e)&&(se(t,e)&&se(e,t)&&vn(t,e)&&(S(t.prev,t,e.prev)||S(t,e.prev,e))||we(t,e)&&S(t.prev,t,t.next)>0&&S(e.prev,e,e.next)>0)}function S(t,e,i){return(e.y-t.y)*(i.x-e.x)-(e.x-t.x)*(i.y-e.y)}function we(t,e){return t.x===e.x&&t.y===e.y}function Tt(t,e,i,n){var o=me(S(t,e,i)),r=me(S(t,e,n)),a=me(S(i,n,t)),s=me(S(i,n,e));return!!(o!==r&&a!==s||o===0&&fe(t,i,e)||r===0&&fe(t,n,e)||a===0&&fe(i,t,n)||s===0&&fe(i,e,n))}function fe(t,e,i){return e.x<=Math.max(t.x,i.x)&&e.x>=Math.min(t.x,i.x)&&e.y<=Math.max(t.y,i.y)&&e.y>=Math.min(t.y,i.y)}function me(t){return t>0?1:t<0?-1:0}function mn(t,e){var i=t;do{if(i.i!==t.i&&i.next.i!==t.i&&i.i!==e.i&&i.next.i!==e.i&&Tt(i,i.next,t,e))return!0;i=i.next}while(i!==t);return!1}function se(t,e){return S(t.prev,t,t.next)<0?S(t,e,t.next)>=0&&S(t,t.prev,e)>=0:S(t,e,t.prev)<0||S(t,t.next,e)<0}function vn(t,e){var i=t,n=!1,o=(t.x+e.x)/2,r=(t.y+e.y)/2;do i.y>r!=i.next.y>r&&i.next.y!==i.y&&o<(i.next.x-i.x)*(r-i.y)/(i.next.y-i.y)+i.x&&(n=!n),i=i.next;while(i!==t);return n}function Ct(t,e){var i=new je(t.i,t.x,t.y),n=new je(e.i,e.x,e.y),o=t.next,r=e.prev;return t.next=e,e.prev=t,i.next=o,o.prev=i,n.next=i,i.prev=n,r.next=n,n.prev=r,n}function gt(t,e,i,n){var o=new je(t,e,i);return n?(o.next=n.next,o.prev=n,n.next.prev=o,n.next=o):(o.prev=o,o.next=o),o}function le(t){t.next.prev=t.prev,t.prev.next=t.next,t.prevZ&&(t.prevZ.nextZ=t.nextZ),t.nextZ&&(t.nextZ.prevZ=t.prevZ)}function je(t,e,i){this.i=t,this.x=e,this.y=i,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}be.deviation=function(t,e,i,n){var o=e&&e.length,r=o?e[0]*i:t.length,a=Math.abs(Ue(t,0,r,i));if(o)for(var s=0,l=e.length;s<l;s++){var c=e[s]*i,h=s<l-1?e[s+1]*i:t.length;a-=Math.abs(Ue(t,c,h,i))}var x=0;for(s=0;s<n.length;s+=3){var p=n[s]*i,m=n[s+1]*i,u=n[s+2]*i;x+=Math.abs((t[p]-t[u])*(t[m+1]-t[p+1])-(t[p]-t[m])*(t[u+1]-t[p+1]))}return a===0&&x===0?0:Math.abs((x-a)/a)};function Ue(t,e,i,n){for(var o=0,r=e,a=i-n;r<i;r+=n)o+=(t[a]-t[r])*(t[r+1]+t[a+1]),a=r;return o}be.flatten=function(t){for(var e=t[0][0].length,i={vertices:[],holes:[],dimensions:e},n=0,o=0;o<t.length;o++){for(var r=0;r<t[o].length;r++)for(var a=0;a<e;a++)i.vertices.push(t[o][r][a]);o>0&&(n+=t[o-1].length,i.holes.push(n))}return i};new C;new C;var bt;(t=>{function e(o){let r=o.slice();return r.sort(t.POINT_COMPARATOR),t.makeHullPresorted(r)}t.makeHull=e;function i(o){if(o.length<=1)return o.slice();let r=[];for(let s=0;s<o.length;s++){const l=o[s];for(;r.length>=2;){const c=r[r.length-1],h=r[r.length-2];if((c.x-h.x)*(l.y-h.y)>=(c.y-h.y)*(l.x-h.x))r.pop();else break}r.push(l)}r.pop();let a=[];for(let s=o.length-1;s>=0;s--){const l=o[s];for(;a.length>=2;){const c=a[a.length-1],h=a[a.length-2];if((c.x-h.x)*(l.y-h.y)>=(c.y-h.y)*(l.x-h.x))a.pop();else break}a.push(l)}return a.pop(),r.length==1&&a.length==1&&r[0].x==a[0].x&&r[0].y==a[0].y?r:r.concat(a)}t.makeHullPresorted=i;function n(o,r){return o.x<r.x?-1:o.x>r.x?1:o.y<r.y?-1:o.y>r.y?1:0}t.POINT_COMPARATOR=n})(bt||(bt={}));new fi;new g;new ne;new Ze;new Fe;new ye;new g;new g;var xn=_e("<!> <!>",1),_n=_e("<!> <!>",1),yn=_e("<!> <!> <!> <!> <!> <!>",1);function gn(t,e){const o="#374151",r="#1f2937";var a=yn(),s=ve(a);j(s,()=>k.PerspectiveCamera,(m,u)=>{u(m,{makeDefault:!0,position:[8,6,8],fov:45,children:(M,N)=>{Vi(M,{enableDamping:!0,dampingFactor:.05})},$$slots:{default:!0}})});var l=_(s,2);j(l,()=>k.AmbientLight,(m,u)=>{u(m,{intensity:.5})});var c=_(l,2);j(c,()=>k.DirectionalLight,(m,u)=>{u(m,{position:[5,10,5],intensity:1.2,castShadow:!0})});var h=_(c,2);j(h,()=>k.GridHelper,(m,u)=>{u(m,{args:[20,20,o,r],position:[0,0,0]})});var x=_(h,2);{let m=U(()=>[0,e.dimY/2,0]);j(x,()=>k.Mesh,(u,M)=>{M(u,{get position(){return d(m)},castShadow:!0,receiveShadow:!0,children:(N,z)=>{var T=xn(),f=ve(T);{let O=U(()=>[e.dimX,e.dimY,e.dimZ]);j(f,()=>k.BoxGeometry,(R,Z)=>{Z(R,{get args(){return d(O)}})})}var v=_(f,2);j(v,()=>k.MeshStandardMaterial,(O,R)=>{R(O,{color:"#4ade80",metalness:.3,roughness:.5})}),oe(N,T)},$$slots:{default:!0}})})}var p=_(x,2);{let m=U(()=>[0,e.dimY/2,0]);j(p,()=>k.Mesh,(u,M)=>{M(u,{get position(){return d(m)},children:(N,z)=>{var T=_n(),f=ve(T);{let O=U(()=>[e.dimX,e.dimY,e.dimZ]);j(f,()=>k.BoxGeometry,(R,Z)=>{Z(R,{get args(){return d(O)}})})}var v=_(f,2);j(v,()=>k.MeshBasicMaterial,(O,R)=>{R(O,{color:"#166534",wireframe:!0})}),oe(N,T)},$$slots:{default:!0}})})}oe(t,a)}var bn=_e('<div class="flex flex-col gap-6 w-full"><div class="flex items-center gap-3"><span class="text-sm font-medium text-gray-400">Units:</span> <div class="flex rounded-lg overflow-hidden border border-gray-600"><button>mm</button> <button>in</button></div></div> <div class="relative w-full rounded-xl overflow-hidden border border-gray-700" style="height: 480px;"><!> <div class="absolute bottom-4 left-4 z-10 bg-gray-900/80 backdrop-blur-sm rounded-xl p-3 border border-gray-700 select-none"><p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Adjust</p> <div class="flex flex-col gap-2"><div class="flex items-center gap-2"><span class="w-20 text-xs text-gray-300">Width (X)</span> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Decrease width">←</button> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Increase width">→</button></div> <div class="flex items-center gap-2"><span class="w-20 text-xs text-gray-300">Height (Y)</span> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Decrease height">↓</button> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Increase height">↑</button></div> <div class="flex items-center gap-2"><span class="w-20 text-xs text-gray-300">Depth (Z)</span> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Decrease depth">←</button> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Increase depth">→</button></div></div></div> <div class="absolute bottom-4 right-4 z-10 bg-gray-900/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-700"><p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Dimensions</p> <div class="flex flex-col gap-1 font-mono text-sm"><div class="flex gap-3"><span class="text-gray-500 w-4">W</span> <span class="text-green-400"> </span></div> <div class="flex gap-3"><span class="text-gray-500 w-4">H</span> <span class="text-green-400"> </span></div> <div class="flex gap-3"><span class="text-gray-500 w-4">D</span> <span class="text-green-400"> </span></div></div></div></div> <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-gray-800 rounded-xl p-6 border border-gray-700"><div class="flex flex-col gap-3"><div class="flex items-center justify-between"><label class="text-sm font-semibold text-gray-200">Width (X)</label> <span class="text-sm font-mono text-green-400"> </span></div> <input type="range" class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700 accent-green-500"/> <input type="number" class="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"/></div> <div class="flex flex-col gap-3"><div class="flex items-center justify-between"><label class="text-sm font-semibold text-gray-200">Height (Y)</label> <span class="text-sm font-mono text-green-400"> </span></div> <input type="range" class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700 accent-green-500"/> <input type="number" class="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"/></div> <div class="flex flex-col gap-3"><div class="flex items-center justify-between"><label class="text-sm font-semibold text-gray-200">Depth (Z)</label> <span class="text-sm font-mono text-green-400"> </span></div> <input type="range" class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700 accent-green-500"/> <input type="number" class="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"/></div></div></div>');function An(t,e){wt(e,!0);const i=1/25,n=1/25.4;let o=ue(100),r=ue(12),a=ue(150),s=ue("mm"),l=U(()=>d(o)*i),c=U(()=>d(r)*i),h=U(()=>d(a)*i);function x(y){return d(s)==="in"?(y*n).toFixed(3):y.toFixed(1)}function p(){return d(s)==="in"?12.7:10}function m(y,he,Re){return Math.max(he,Math.min(Re,y))}function u(y){L(o,m(d(o)+p()*y,10,500),!0)}function M(y){L(r,m(d(r)+p()*y,1,200),!0)}function N(y){L(a,m(d(a)+p()*y,10,500),!0)}function z(y){return d(s)==="in"?+(y*n).toFixed(4):y}function T(y){return d(s)==="in"?+y*25.4:+y}let f=U(()=>d(s)==="in"?{min:+(10*n).toFixed(3),max:+(500*n).toFixed(3),step:+(10*n).toFixed(3)}:{min:10,max:500,step:10}),v=U(()=>d(s)==="in"?{min:+(1*n).toFixed(3),max:+(200*n).toFixed(3),step:+(1*n).toFixed(3)}:{min:1,max:200,step:1}),O=U(()=>d(s)==="in"?{min:+(10*n).toFixed(3),max:+(500*n).toFixed(3),step:+(10*n).toFixed(3)}:{min:10,max:500,step:10});var R=bn(),Z=w(R),Ve=_(w(Z),2),De=w(Ve),Ke=_(De,2);D(Ve),D(Z);var Se=_(Z,2),Xe=w(Se);mi(Xe,{children:(y,he)=>{gn(y,{get dimX(){return d(l)},get dimY(){return d(c)},get dimZ(){return d(h)}})},$$slots:{default:!0}});var Ee=_(Xe,2),qe=_(w(Ee),2),Pe=w(qe),Qe=_(w(Pe),2),Ot=_(Qe,2);D(Pe);var Me=_(Pe,2),Je=_(w(Me),2),It=_(Je,2);D(Me);var et=_(Me,2),tt=_(w(et),2),At=_(tt,2);D(et),D(qe),D(Ee);var it=_(Ee,2),nt=_(w(it),2),Te=w(nt),ot=_(w(Te),2),Nt=w(ot);D(ot),D(Te);var Ce=_(Te,2),rt=_(w(Ce),2),zt=w(rt);D(rt),D(Ce);var at=_(Ce,2),st=_(w(at),2),Rt=w(st);D(st),D(at),D(nt),D(it),D(Se);var lt=_(Se,2),Oe=w(lt),Ie=w(Oe),ct=_(w(Ie),2),Lt=w(ct);D(ct),D(Ie);var H=_(Ie,2);J(H);var V=_(H,2);J(V),D(Oe);var Ae=_(Oe,2),Ne=w(Ae),dt=_(w(Ne),2),kt=w(dt);D(dt),D(Ne);var Y=_(Ne,2);J(Y);var K=_(Y,2);J(K),D(Ae);var ht=_(Ae,2),ze=w(ht),ut=_(w(ze),2),jt=w(ut);D(ut),D(ze);var B=_(ze,2);J(B);var X=_(B,2);J(X),D(ht),D(lt),D(R),qt((y,he,Re,Ut,Ft,Zt,Ht,Yt,Bt,$t,Gt,Wt)=>{pt(De,1,`px-4 py-1.5 text-sm font-semibold transition-colors ${d(s)==="mm"?"bg-green-500 text-white":"bg-gray-800 text-gray-400 hover:text-white"}`),pt(Ke,1,`px-4 py-1.5 text-sm font-semibold transition-colors ${d(s)==="in"?"bg-green-500 text-white":"bg-gray-800 text-gray-400 hover:text-white"}`),q(Nt,`${y??""} ${d(s)??""}`),q(zt,`${he??""} ${d(s)??""}`),q(Rt,`${Re??""} ${d(s)??""}`),q(Lt,`${Ut??""} ${d(s)??""}`),P(H,"min",d(f).min),P(H,"max",d(f).max),P(H,"step",d(f).step),Q(H,Ft),P(V,"min",d(f).min),P(V,"max",d(f).max),P(V,"step",d(f).step),Q(V,Zt),q(kt,`${Ht??""} ${d(s)??""}`),P(Y,"min",d(v).min),P(Y,"max",d(v).max),P(Y,"step",d(v).step),Q(Y,Yt),P(K,"min",d(v).min),P(K,"max",d(v).max),P(K,"step",d(v).step),Q(K,Bt),q(jt,`${$t??""} ${d(s)??""}`),P(B,"min",d(O).min),P(B,"max",d(O).max),P(B,"step",d(O).step),Q(B,Gt),P(X,"min",d(O).min),P(X,"max",d(O).max),P(X,"step",d(O).step),Q(X,Wt)},[()=>x(d(o)),()=>x(d(r)),()=>x(d(a)),()=>x(d(o)),()=>z(d(o)),()=>z(d(o)),()=>x(d(r)),()=>z(d(r)),()=>z(d(r)),()=>x(d(a)),()=>z(d(a)),()=>z(d(a))]),I("click",De,()=>L(s,"mm")),I("click",Ke,()=>L(s,"in")),I("click",Qe,()=>u(-1)),I("click",Ot,()=>u(1)),I("click",Je,()=>M(-1)),I("click",It,()=>M(1)),I("click",tt,()=>N(-1)),I("click",At,()=>N(1)),I("input",H,y=>{L(o,m(T(y.currentTarget.value),10,500),!0)}),I("input",V,y=>{L(o,m(T(y.currentTarget.value),10,500),!0)}),I("input",Y,y=>{L(r,m(T(y.currentTarget.value),1,200),!0)}),I("input",K,y=>{L(r,m(T(y.currentTarget.value),1,200),!0)}),I("input",B,y=>{L(a,m(T(y.currentTarget.value),10,500),!0)}),I("input",X,y=>{L(a,m(T(y.currentTarget.value),10,500),!0)}),oe(t,R),Dt()}Qt(["click","input"]);export{An as default};
