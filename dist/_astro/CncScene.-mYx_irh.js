import"./disclose-version.DsnmJJEf.js";import{_ as We,q as K,$ as Ke,a0 as $e,a1 as Xe,k as qe,a2 as Qe,p as Je,a3 as et,h as tt,i as ae,a4 as it,a as $,b as nt,d as b,f as le,g as D,a5 as ie,t as ot,e as pe,c as C,r as O,s as F}from"./template.BEFC74iZ.js";import{s as me}from"./render.BW0m_lH2.js";import{r as H}from"./attributes.BgnuyohC.js";import{u as rt,c as U,D as ee,V as _,S as we,M as V,R as De,O as at,a as E,B as ce,U as se,b as st,d as lt,e as te,L as ct,C as ht,f as G,T as Y,Q as Ae,g as Ne,P as dt,h as ut,i as ft,j as pt,k as mt,l as vt,m as A,n as _t,o as R,p as yt,q as xt,F as ze,r as gt,s as z,t as bt}from"./T.CvAd8p_J.js";import{s as wt}from"./snippet.D339x60i.js";import{d as Dt,w as Re,p as St,s as Et,a as Pt,b as Mt,r as Tt}from"./props.BEYwhFZK.js";import"./branches.Cx6n2Cv9.js";import"./if.Dys-jF6n.js";function Z(t,e,i=e){var n=new WeakSet;We(t,"input",async o=>{var r=o?t.defaultValue:t.value;if(r=ve(t)?_e(r):r,i(r),K!==null&&n.add(K),await Ke(),r!==(r=e())){var a=t.selectionStart,s=t.selectionEnd,c=t.value.length;if(t.value=r??"",s!==null){var l=t.value.length;a===s&&s===c&&l>c?(t.selectionStart=l,t.selectionEnd=l):(t.selectionStart=a,t.selectionEnd=Math.min(s,l))}}}),(qe&&t.defaultValue!==t.value||$e(e)==null&&t.value)&&(i(ve(t)?_e(t.value):t.value),K!==null&&n.add(K)),Xe(()=>{var o=e();if(t===document.activeElement){var r=Qe??K;if(n.has(r))return}ve(t)&&o===_e(t.value)||t.type==="date"&&!o&&!t.value||o!==t.value&&(t.value=o??"")})}function ve(t){var e=t.type;return e==="number"||e==="range"}function _e(t){return t===""?null:+t}function Ct(t,e,i){const n=rt();if(!n)throw new Error("No user context store found, did you invoke this function outside of your main <Canvas> component?");return e?(n.update(o=>{if(t in o)return o;const r=typeof e=="function"?e():e;return o[t]=r,o}),n.current[t]):Dt(n,o=>o[t])}const L=t=>({subscribe:t.subscribe,get current(){return t.current}});let X=0;const Se=U(!1),he=U(!1),Ee=U(void 0),Pe=U(0),Me=U(0),Fe=U([]),Te=U(0),{onStart:Ot,onLoad:It,onError:At}=ee;ee.onStart=(t,e,i)=>{Ot?.(t,e,i),he.set(!0),Ee.set(t),Pe.set(e),Me.set(i);const n=(e-X)/(i-X);Te.set(n),n===1&&Se.set(!0)};ee.onLoad=()=>{It?.(),he.set(!1)};ee.onError=t=>{At?.(t),Fe.update(e=>[...e,t])};ee.onProgress=(t,e,i)=>{e===i&&(X=i),he.set(!0),Ee.set(t),Pe.set(e),Me.set(i);const n=(e-X)/(i-X)||1;Te.set(n),n===1&&Se.set(!0)};L(he),L(Ee),L(Pe),L(Me),L(Fe),L(Te),L(Se);new _;new _;new _;new we;new V;new De;new _;new _;new V;new _;new _;new at;new _;new _;new _;new E;const Nt="Right",zt="Top",Rt="Front",Lt="Left",kt="Bottom",Ut="Back";[Nt,zt,Rt,Lt,kt,Ut].map(t=>t.toLocaleLowerCase());new ce;new _;se.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new E(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};st.line={uniforms:lt.merge([se.common,se.fog,se.line]),vertexShader:`
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
		`};new te;new _;new _;new te;new te;new te;new _;new V;new ct;new _;new ce;new we;new te;const Le={type:"change"},Ce={type:"start"},He={type:"end"},ne=new De,ke=new dt,jt=Math.cos(70*ut.DEG2RAD),g=new _,P=2*Math.PI,y={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},ye=1e-6;let Ft=class extends ht{constructor(e,i=null){super(e,i),this.state=y.NONE,this.enabled=!0,this.target=new _,this.cursor=new _,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:G.ROTATE,MIDDLE:G.DOLLY,RIGHT:G.PAN},this.touches={ONE:Y.ROTATE,TWO:Y.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new _,this._lastQuaternion=new Ae,this._lastTargetPosition=new _,this._quat=new Ae().setFromUnitVectors(e.up,new _(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Ne,this._sphericalDelta=new Ne,this._scale=1,this._panOffset=new _,this._rotateStart=new E,this._rotateEnd=new E,this._rotateDelta=new E,this._panStart=new E,this._panEnd=new E,this._panDelta=new E,this._dollyStart=new E,this._dollyEnd=new E,this._dollyDelta=new E,this._dollyDirection=new _,this._mouse=new E,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Zt.bind(this),this._onPointerDown=Ht.bind(this),this._onPointerUp=Yt.bind(this),this._onContextMenu=Xt.bind(this),this._onMouseWheel=Vt.bind(this),this._onKeyDown=Wt.bind(this),this._onTouchStart=Kt.bind(this),this._onTouchMove=$t.bind(this),this._onMouseDown=Bt.bind(this),this._onMouseMove=Gt.bind(this),this._interceptControlDown=qt.bind(this),this._interceptControlUp=Qt.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Le),this.update(),this.state=y.NONE}update(e=null){const i=this.object.position;g.copy(i).sub(this.target),g.applyQuaternion(this._quat),this._spherical.setFromVector3(g),this.autoRotate&&this.state===y.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,o=this.maxAzimuthAngle;isFinite(n)&&isFinite(o)&&(n<-Math.PI?n+=P:n>Math.PI&&(n-=P),o<-Math.PI?o+=P:o>Math.PI&&(o-=P),n<=o?this._spherical.theta=Math.max(n,Math.min(o,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+o)/2?Math.max(n,this._spherical.theta):Math.min(o,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(g.setFromSpherical(this._spherical),g.applyQuaternion(this._quatInverse),i.copy(this.target).add(g),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const s=g.length();a=this._clampDistance(s*this._scale);const c=s-a;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){const s=new _(this._mouse.x,this._mouse.y,0);s.unproject(this.object);const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;const l=new _(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(s),this.object.updateMatrixWorld(),a=g.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(ne.origin.copy(this.object.position),ne.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(ne.direction))<jt?this.object.lookAt(this.target):(ke.setFromNormalAndCoplanarPoint(this.object.up,this.target),ne.intersectPlane(ke,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>ye||8*(1-this._lastQuaternion.dot(this.object.quaternion))>ye||this._lastTargetPosition.distanceToSquared(this.target)>ye?(this.dispatchEvent(Le),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?P/60*this.autoRotateSpeed*e:P/60/60*this.autoRotateSpeed}_getZoomScale(e){const i=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*i)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,i){g.setFromMatrixColumn(i,0),g.multiplyScalar(-e),this._panOffset.add(g)}_panUp(e,i){this.screenSpacePanning===!0?g.setFromMatrixColumn(i,1):(g.setFromMatrixColumn(i,0),g.crossVectors(this.object.up,g)),g.multiplyScalar(e),this._panOffset.add(g)}_pan(e,i){const n=this.domElement;if(this.object.isPerspectiveCamera){const o=this.object.position;g.copy(o).sub(this.target);let r=g.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*i*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(i*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,i){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),o=e-n.left,r=i-n.top,a=n.width,s=n.height;this._mouse.x=o/a*2-1,this._mouse.y=-(r/s)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const i=this.domElement;this._rotateLeft(P*this._rotateDelta.x/i.clientHeight),this._rotateUp(P*this._rotateDelta.y/i.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let i=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(P*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),i=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(-P*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),i=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(P*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),i=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(-P*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),i=!0;break}i&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),n=.5*(e.pageX+i.x),o=.5*(e.pageY+i.y);this._rotateStart.set(n,o)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),n=.5*(e.pageX+i.x),o=.5*(e.pageY+i.y);this._panStart.set(n,o)}}_handleTouchStartDolly(e){const i=this._getSecondPointerPosition(e),n=e.pageX-i.x,o=e.pageY-i.y,r=Math.sqrt(n*n+o*o);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),o=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(o,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const i=this.domElement;this._rotateLeft(P*this._rotateDelta.x/i.clientHeight),this._rotateUp(P*this._rotateDelta.y/i.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),n=.5*(e.pageX+i.x),o=.5*(e.pageY+i.y);this._panEnd.set(n,o)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const i=this._getSecondPointerPosition(e),n=e.pageX-i.x,o=e.pageY-i.y,r=Math.sqrt(n*n+o*o);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+i.x)*.5,s=(e.pageY+i.y)*.5;this._updateZoomParameters(a,s)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let i=0;i<this._pointers.length;i++)if(this._pointers[i]==e.pointerId){this._pointers.splice(i,1);return}}_isTrackingPointer(e){for(let i=0;i<this._pointers.length;i++)if(this._pointers[i]==e.pointerId)return!0;return!1}_trackPointer(e){let i=this._pointerPositions[e.pointerId];i===void 0&&(i=new E,this._pointerPositions[e.pointerId]=i),i.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const i=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[i]}_customWheelEvent(e){const i=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(i){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function Ht(t){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(t.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(t)&&(this._addPointer(t),t.pointerType==="touch"?this._onTouchStart(t):this._onMouseDown(t)))}function Zt(t){this.enabled!==!1&&(t.pointerType==="touch"?this._onTouchMove(t):this._onMouseMove(t))}function Yt(t){switch(this._removePointer(t),this._pointers.length){case 0:this.domElement.releasePointerCapture(t.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(He),this.state=y.NONE;break;case 1:const e=this._pointers[0],i=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:i.x,pageY:i.y});break}}function Bt(t){let e;switch(t.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case G.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(t),this.state=y.DOLLY;break;case G.ROTATE:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=y.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=y.ROTATE}break;case G.PAN:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=y.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=y.PAN}break;default:this.state=y.NONE}this.state!==y.NONE&&this.dispatchEvent(Ce)}function Gt(t){switch(this.state){case y.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(t);break;case y.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(t);break;case y.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(t);break}}function Vt(t){this.enabled===!1||this.enableZoom===!1||this.state!==y.NONE||(t.preventDefault(),this.dispatchEvent(Ce),this._handleMouseWheel(this._customWheelEvent(t)),this.dispatchEvent(He))}function Wt(t){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(t)}function Kt(t){switch(this._trackPointer(t),this._pointers.length){case 1:switch(this.touches.ONE){case Y.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(t),this.state=y.TOUCH_ROTATE;break;case Y.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(t),this.state=y.TOUCH_PAN;break;default:this.state=y.NONE}break;case 2:switch(this.touches.TWO){case Y.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(t),this.state=y.TOUCH_DOLLY_PAN;break;case Y.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(t),this.state=y.TOUCH_DOLLY_ROTATE;break;default:this.state=y.NONE}break;default:this.state=y.NONE}this.state!==y.NONE&&this.dispatchEvent(Ce)}function $t(t){switch(this._trackPointer(t),this.state){case y.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(t),this.update();break;case y.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(t),this.update();break;case y.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(t),this.update();break;case y.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(t),this.update();break;default:this.state=y.NONE}}function Xt(t){this.enabled!==!1&&t.preventDefault()}function qt(t){t.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Qt(t){t.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const Jt=()=>Ct("threlte-controls",{orbitControls:Re(void 0),trackballControls:Re(void 0)});function ei(t,e){Je(e,!0);const i=()=>Pt(s,"$parent",n),[n,o]=Mt();let r=St(e,"ref",15),a=Tt(e,["$$slots","$$events","$$legacy","ref","children"]);const s=ft(),{dom:c,invalidate:l}=pt();if(!mt(i(),"Camera"))throw new Error("Parent missing: <OrbitControls> need to be a child of a <Camera>");const h=new Ft(i(),c),{orbitControls:m}=Jt();vt(()=>{h.update()},{running:()=>e.autoRotate??e.enableDamping??!1}),et(()=>{const u=v=>{l(),e.onchange?.(v)};return m.set(h),h.addEventListener("change",u),()=>{m.set(void 0),h.removeEventListener("change",u)}}),A(t,Et({get is(){return h}},()=>a,{get ref(){return r()},set ref(u){r(u)},children:(u,v)=>{var d=tt(),w=ae(d);wt(w,()=>e.children??it,()=>({ref:h})),$(u,d)},$$slots:{default:!0}})),nt(),o()}new V;new V;new _t;`${R.logdepthbuf_pars_vertex}${R.fog_pars_vertex}${R.logdepthbuf_vertex}${R.fog_vertex}`;`${R.tonemapping_fragment}${R.colorspace_fragment}`;`${R.tonemapping_fragment}${R.colorspace_fragment}`;const ti=`

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
`,ii=`

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
`,ni=`
struct BVH {

	usampler2D index;
	sampler2D position;

	sampler2D bvhBounds;
	usampler2D bvhContents;

};
`,oi=ni,ri=`
	${ti}
	${ii}
`;`${oi}${ri}${R.tonemapping_fragment}${R.colorspace_fragment}`;new ce;typeof window<"u"&&document.createElement("div");for(let t=0;t<256;t++)(t<16?"0":"")+t.toString(16);new yt(-1,1,1,-1,0,1);class ai extends xt{constructor(){super(),this.setAttribute("position",new ze([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ze([0,2,0,0,2,0],2))}}new ai;var Ze={exports:{}};Ze.exports=de;Ze.exports.default=de;function de(t,e,i){i=i||2;var n=e&&e.length,o=n?e[0]*i:t.length,r=Ye(t,0,o,i,!0),a=[];if(!r||r.next===r.prev)return a;var s,c,l,h,m,u,v;if(n&&(r=di(t,e,r,i)),t.length>80*i){s=l=t[0],c=h=t[1];for(var d=i;d<o;d+=i)m=t[d],u=t[d+1],m<s&&(s=m),u<c&&(c=u),m>l&&(l=m),u>h&&(h=u);v=Math.max(l-s,h-c),v=v!==0?32767/v:0}return q(r,a,i,s,c,v,0),a}function Ye(t,e,i,n,o){var r,a;if(o===be(t,e,i,n)>0)for(r=e;r<i;r+=n)a=Ue(r,t[r],t[r+1],a);else for(r=i-n;r>=e;r-=n)a=Ue(r,t[r],t[r+1],a);return a&&ue(a,a.next)&&(J(a),a=a.next),a}function k(t,e){if(!t)return t;e||(e=t);var i=t,n;do if(n=!1,!i.steiner&&(ue(i,i.next)||x(i.prev,i,i.next)===0)){if(J(i),i=e=i.prev,i===i.next)break;n=!0}else i=i.next;while(n||i!==e);return e}function q(t,e,i,n,o,r,a){if(t){!a&&r&&vi(t,n,o,r);for(var s=t,c,l;t.prev!==t.next;){if(c=t.prev,l=t.next,r?li(t,n,o,r):si(t)){e.push(c.i/i|0),e.push(t.i/i|0),e.push(l.i/i|0),J(t),t=l.next,s=l.next;continue}if(t=l,t===s){a?a===1?(t=ci(k(t),e,i),q(t,e,i,n,o,r,2)):a===2&&hi(t,e,i,n,o,r):q(k(t),e,i,n,o,r,1);break}}}}function si(t){var e=t.prev,i=t,n=t.next;if(x(e,i,n)>=0)return!1;for(var o=e.x,r=i.x,a=n.x,s=e.y,c=i.y,l=n.y,h=o<r?o<a?o:a:r<a?r:a,m=s<c?s<l?s:l:c<l?c:l,u=o>r?o>a?o:a:r>a?r:a,v=s>c?s>l?s:l:c>l?c:l,d=n.next;d!==e;){if(d.x>=h&&d.x<=u&&d.y>=m&&d.y<=v&&B(o,s,r,c,a,l,d.x,d.y)&&x(d.prev,d,d.next)>=0)return!1;d=d.next}return!0}function li(t,e,i,n){var o=t.prev,r=t,a=t.next;if(x(o,r,a)>=0)return!1;for(var s=o.x,c=r.x,l=a.x,h=o.y,m=r.y,u=a.y,v=s<c?s<l?s:l:c<l?c:l,d=h<m?h<u?h:u:m<u?m:u,w=s>c?s>l?s:l:c>l?c:l,M=h>m?h>u?h:u:m>u?m:u,j=xe(v,d,e,i,n),T=xe(w,M,e,i,n),f=t.prevZ,p=t.nextZ;f&&f.z>=j&&p&&p.z<=T;){if(f.x>=v&&f.x<=w&&f.y>=d&&f.y<=M&&f!==o&&f!==a&&B(s,h,c,m,l,u,f.x,f.y)&&x(f.prev,f,f.next)>=0||(f=f.prevZ,p.x>=v&&p.x<=w&&p.y>=d&&p.y<=M&&p!==o&&p!==a&&B(s,h,c,m,l,u,p.x,p.y)&&x(p.prev,p,p.next)>=0))return!1;p=p.nextZ}for(;f&&f.z>=j;){if(f.x>=v&&f.x<=w&&f.y>=d&&f.y<=M&&f!==o&&f!==a&&B(s,h,c,m,l,u,f.x,f.y)&&x(f.prev,f,f.next)>=0)return!1;f=f.prevZ}for(;p&&p.z<=T;){if(p.x>=v&&p.x<=w&&p.y>=d&&p.y<=M&&p!==o&&p!==a&&B(s,h,c,m,l,u,p.x,p.y)&&x(p.prev,p,p.next)>=0)return!1;p=p.nextZ}return!0}function ci(t,e,i){var n=t;do{var o=n.prev,r=n.next.next;!ue(o,r)&&Be(o,n,n.next,r)&&Q(o,r)&&Q(r,o)&&(e.push(o.i/i|0),e.push(n.i/i|0),e.push(r.i/i|0),J(n),J(n.next),n=t=r),n=n.next}while(n!==t);return k(n)}function hi(t,e,i,n,o,r){var a=t;do{for(var s=a.next.next;s!==a.prev;){if(a.i!==s.i&&xi(a,s)){var c=Ge(a,s);a=k(a,a.next),c=k(c,c.next),q(a,e,i,n,o,r,0),q(c,e,i,n,o,r,0);return}s=s.next}a=a.next}while(a!==t)}function di(t,e,i,n){var o=[],r,a,s,c,l;for(r=0,a=e.length;r<a;r++)s=e[r]*n,c=r<a-1?e[r+1]*n:t.length,l=Ye(t,s,c,n,!1),l===l.next&&(l.steiner=!0),o.push(yi(l));for(o.sort(ui),r=0;r<o.length;r++)i=fi(o[r],i);return i}function ui(t,e){return t.x-e.x}function fi(t,e){var i=pi(t,e);if(!i)return e;var n=Ge(i,t);return k(n,n.next),k(i,i.next)}function pi(t,e){var i=e,n=t.x,o=t.y,r=-1/0,a;do{if(o<=i.y&&o>=i.next.y&&i.next.y!==i.y){var s=i.x+(o-i.y)*(i.next.x-i.x)/(i.next.y-i.y);if(s<=n&&s>r&&(r=s,a=i.x<i.next.x?i:i.next,s===n))return a}i=i.next}while(i!==e);if(!a)return null;var c=a,l=a.x,h=a.y,m=1/0,u;i=a;do n>=i.x&&i.x>=l&&n!==i.x&&B(o<h?n:r,o,l,h,o<h?r:n,o,i.x,i.y)&&(u=Math.abs(o-i.y)/(n-i.x),Q(i,t)&&(u<m||u===m&&(i.x>a.x||i.x===a.x&&mi(a,i)))&&(a=i,m=u)),i=i.next;while(i!==c);return a}function mi(t,e){return x(t.prev,t,e.prev)<0&&x(e.next,t,t.next)<0}function vi(t,e,i,n){var o=t;do o.z===0&&(o.z=xe(o.x,o.y,e,i,n)),o.prevZ=o.prev,o.nextZ=o.next,o=o.next;while(o!==t);o.prevZ.nextZ=null,o.prevZ=null,_i(o)}function _i(t){var e,i,n,o,r,a,s,c,l=1;do{for(i=t,t=null,r=null,a=0;i;){for(a++,n=i,s=0,e=0;e<l&&(s++,n=n.nextZ,!!n);e++);for(c=l;s>0||c>0&&n;)s!==0&&(c===0||!n||i.z<=n.z)?(o=i,i=i.nextZ,s--):(o=n,n=n.nextZ,c--),r?r.nextZ=o:t=o,o.prevZ=r,r=o;i=n}r.nextZ=null,l*=2}while(a>1);return t}function xe(t,e,i,n,o){return t=(t-i)*o|0,e=(e-n)*o|0,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t|e<<1}function yi(t){var e=t,i=t;do(e.x<i.x||e.x===i.x&&e.y<i.y)&&(i=e),e=e.next;while(e!==t);return i}function B(t,e,i,n,o,r,a,s){return(o-a)*(e-s)>=(t-a)*(r-s)&&(t-a)*(n-s)>=(i-a)*(e-s)&&(i-a)*(r-s)>=(o-a)*(n-s)}function xi(t,e){return t.next.i!==e.i&&t.prev.i!==e.i&&!gi(t,e)&&(Q(t,e)&&Q(e,t)&&bi(t,e)&&(x(t.prev,t,e.prev)||x(t,e.prev,e))||ue(t,e)&&x(t.prev,t,t.next)>0&&x(e.prev,e,e.next)>0)}function x(t,e,i){return(e.y-t.y)*(i.x-e.x)-(e.x-t.x)*(i.y-e.y)}function ue(t,e){return t.x===e.x&&t.y===e.y}function Be(t,e,i,n){var o=re(x(t,e,i)),r=re(x(t,e,n)),a=re(x(i,n,t)),s=re(x(i,n,e));return!!(o!==r&&a!==s||o===0&&oe(t,i,e)||r===0&&oe(t,n,e)||a===0&&oe(i,t,n)||s===0&&oe(i,e,n))}function oe(t,e,i){return e.x<=Math.max(t.x,i.x)&&e.x>=Math.min(t.x,i.x)&&e.y<=Math.max(t.y,i.y)&&e.y>=Math.min(t.y,i.y)}function re(t){return t>0?1:t<0?-1:0}function gi(t,e){var i=t;do{if(i.i!==t.i&&i.next.i!==t.i&&i.i!==e.i&&i.next.i!==e.i&&Be(i,i.next,t,e))return!0;i=i.next}while(i!==t);return!1}function Q(t,e){return x(t.prev,t,t.next)<0?x(t,e,t.next)>=0&&x(t,t.prev,e)>=0:x(t,e,t.prev)<0||x(t,t.next,e)<0}function bi(t,e){var i=t,n=!1,o=(t.x+e.x)/2,r=(t.y+e.y)/2;do i.y>r!=i.next.y>r&&i.next.y!==i.y&&o<(i.next.x-i.x)*(r-i.y)/(i.next.y-i.y)+i.x&&(n=!n),i=i.next;while(i!==t);return n}function Ge(t,e){var i=new ge(t.i,t.x,t.y),n=new ge(e.i,e.x,e.y),o=t.next,r=e.prev;return t.next=e,e.prev=t,i.next=o,o.prev=i,n.next=i,i.prev=n,r.next=n,n.prev=r,n}function Ue(t,e,i,n){var o=new ge(t,e,i);return n?(o.next=n.next,o.prev=n,n.next.prev=o,n.next=o):(o.prev=o,o.next=o),o}function J(t){t.next.prev=t.prev,t.prev.next=t.next,t.prevZ&&(t.prevZ.nextZ=t.nextZ),t.nextZ&&(t.nextZ.prevZ=t.prevZ)}function ge(t,e,i){this.i=t,this.x=e,this.y=i,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}de.deviation=function(t,e,i,n){var o=e&&e.length,r=o?e[0]*i:t.length,a=Math.abs(be(t,0,r,i));if(o)for(var s=0,c=e.length;s<c;s++){var l=e[s]*i,h=s<c-1?e[s+1]*i:t.length;a-=Math.abs(be(t,l,h,i))}var m=0;for(s=0;s<n.length;s+=3){var u=n[s]*i,v=n[s+1]*i,d=n[s+2]*i;m+=Math.abs((t[u]-t[d])*(t[v+1]-t[u+1])-(t[u]-t[v])*(t[d+1]-t[u+1]))}return a===0&&m===0?0:Math.abs((m-a)/a)};function be(t,e,i,n){for(var o=0,r=e,a=i-n;r<i;r+=n)o+=(t[a]-t[r])*(t[r+1]+t[a+1]),a=r;return o}de.flatten=function(t){for(var e=t[0][0].length,i={vertices:[],holes:[],dimensions:e},n=0,o=0;o<t.length;o++){for(var r=0;r<t[o].length;r++)for(var a=0;a<e;a++)i.vertices.push(t[o][r][a]);o>0&&(n+=t[o-1].length,i.holes.push(n))}return i};new E;new E;var je;(t=>{function e(o){let r=o.slice();return r.sort(t.POINT_COMPARATOR),t.makeHullPresorted(r)}t.makeHull=e;function i(o){if(o.length<=1)return o.slice();let r=[];for(let s=0;s<o.length;s++){const c=o[s];for(;r.length>=2;){const l=r[r.length-1],h=r[r.length-2];if((l.x-h.x)*(c.y-h.y)>=(l.y-h.y)*(c.x-h.x))r.pop();else break}r.push(c)}r.pop();let a=[];for(let s=o.length-1;s>=0;s--){const c=o[s];for(;a.length>=2;){const l=a[a.length-1],h=a[a.length-2];if((l.x-h.x)*(c.y-h.y)>=(l.y-h.y)*(c.x-h.x))a.pop();else break}a.push(c)}return a.pop(),r.length==1&&a.length==1&&r[0].x==a[0].x&&r[0].y==a[0].y?r:r.concat(a)}t.makeHullPresorted=i;function n(o,r){return o.x<r.x?-1:o.x>r.x?1:o.y<r.y?-1:o.y>r.y?1:0}t.POINT_COMPARATOR=n})(je||(je={}));new gt;new _;new V;new De;new we;new ce;new _;new _;var wi=le("<!> <!>",1),Di=le("<!> <!>",1),Si=le("<!> <!> <!> <!> <!> <!>",1);function Ei(t,e){const o="#374151",r="#1f2937";var a=Si(),s=ae(a);z(s,()=>A.PerspectiveCamera,(v,d)=>{d(v,{makeDefault:!0,position:[8,6,8],fov:45,children:(w,M)=>{ei(w,{enableDamping:!0,dampingFactor:.05})},$$slots:{default:!0}})});var c=b(s,2);z(c,()=>A.AmbientLight,(v,d)=>{d(v,{intensity:.5})});var l=b(c,2);z(l,()=>A.DirectionalLight,(v,d)=>{d(v,{position:[5,10,5],intensity:1.2,castShadow:!0})});var h=b(l,2);z(h,()=>A.GridHelper,(v,d)=>{d(v,{args:[20,20,o,r],position:[0,0,0]})});var m=b(h,2);{let v=ie(()=>[0,e.dimY/2,0]);z(m,()=>A.Mesh,(d,w)=>{w(d,{get position(){return D(v)},castShadow:!0,receiveShadow:!0,children:(M,j)=>{var T=wi(),f=ae(T);{let I=ie(()=>[e.dimX,e.dimY,e.dimZ]);z(f,()=>A.BoxGeometry,(N,W)=>{W(N,{get args(){return D(I)}})})}var p=b(f,2);z(p,()=>A.MeshStandardMaterial,(I,N)=>{N(I,{color:"#4ade80",metalness:.3,roughness:.5})}),$(M,T)},$$slots:{default:!0}})})}var u=b(m,2);{let v=ie(()=>[0,e.dimY/2,0]);z(u,()=>A.Mesh,(d,w)=>{w(d,{get position(){return D(v)},children:(M,j)=>{var T=Di(),f=ae(T);{let I=ie(()=>[e.dimX,e.dimY,e.dimZ]);z(f,()=>A.BoxGeometry,(N,W)=>{W(N,{get args(){return D(I)}})})}var p=b(f,2);z(p,()=>A.MeshBasicMaterial,(I,N)=>{N(I,{color:"#166534",wireframe:!0})}),$(M,T)},$$slots:{default:!0}})})}$(t,a)}var Pi=le('<div class="flex flex-col gap-6 w-full"><div class="w-full rounded-xl overflow-hidden border border-gray-700" style="height: 480px;"><!></div> <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-gray-800 rounded-xl p-6 border border-gray-700"><div class="flex flex-col gap-3"><div class="flex items-center justify-between"><label class="text-sm font-semibold text-gray-200">Width (X)</label> <span class="text-sm font-mono text-green-400"> </span></div> <input type="range" min="0.1" max="10" step="0.1" class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700 accent-green-500"/> <input type="number" min="0.1" max="10" step="0.1" class="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"/></div> <div class="flex flex-col gap-3"><div class="flex items-center justify-between"><label class="text-sm font-semibold text-gray-200">Height (Y)</label> <span class="text-sm font-mono text-green-400"> </span></div> <input type="range" min="0.1" max="5" step="0.1" class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700 accent-green-500"/> <input type="number" min="0.1" max="5" step="0.1" class="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"/></div> <div class="flex flex-col gap-3"><div class="flex items-center justify-between"><label class="text-sm font-semibold text-gray-200">Depth (Z)</label> <span class="text-sm font-mono text-green-400"> </span></div> <input type="range" min="0.1" max="10" step="0.1" class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700 accent-green-500"/> <input type="number" min="0.1" max="10" step="0.1" class="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"/></div></div></div>');function ki(t){let e=pe(4),i=pe(.5),n=pe(6);var o=Pi(),r=C(o),a=C(r);bt(a,{children:(S,Ie)=>{Ei(S,{get dimX(){return D(e)},get dimY(){return D(i)},get dimZ(){return D(n)}})},$$slots:{default:!0}}),O(r);var s=b(r,2),c=C(s),l=C(c),h=b(C(l),2),m=C(h);O(h),O(l);var u=b(l,2);H(u);var v=b(u,2);H(v),O(c);var d=b(c,2),w=C(d),M=b(C(w),2),j=C(M);O(M),O(w);var T=b(w,2);H(T);var f=b(T,2);H(f),O(d);var p=b(d,2),I=C(p),N=b(C(I),2),W=C(N);O(N),O(I);var fe=b(I,2);H(fe);var Oe=b(fe,2);H(Oe),O(p),O(s),O(o),ot((S,Ie,Ve)=>{me(m,`${S??""} units`),me(j,`${Ie??""} units`),me(W,`${Ve??""} units`)},[()=>D(e).toFixed(1),()=>D(i).toFixed(1),()=>D(n).toFixed(1)]),Z(u,()=>D(e),S=>F(e,S)),Z(v,()=>D(e),S=>F(e,S)),Z(T,()=>D(i),S=>F(i,S)),Z(f,()=>D(i),S=>F(i,S)),Z(fe,()=>D(n),S=>F(n,S)),Z(Oe,()=>D(n),S=>F(n,S)),$(t,o)}export{ki as default};
