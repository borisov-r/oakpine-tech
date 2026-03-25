import"./disclose-version.DsnmJJEf.js";import{o as ft,q as pt,p as Ye,u as Ct,c as Tt,f as V,v as It,a as F,h as Ze,s as u,g as D,j as pe,d as $,i as he,w as W,t as et,e as Y,r as U}from"./template.DwZH6Bcb.js";import{d as At,a as ce,s as Ee}from"./render.LwaxfeWS.js";import{e as jt,i as kt}from"./each.Dowz_L7o.js";import{s as Re}from"./class.DILcIZTS.js";import{p as tt,u as Nt,c as re,D as De,V as I,S as Fe,M as ye,R as Ge,O as Rt,a as Q,B as Ae,U as Ie,b as zt,d as Lt,e as Me,L as Ut,C as Ht,f as _e,T as ve,Q as it,g as nt,P as Yt,h as Zt,i as Ft,j as vt,k as mt,l as Gt,m as _,n as Bt,o as ae,w as _t,q as Xt,r as Wt,s as $t,t as Vt,v as Kt,F as ot,x as qt,y,z as Qt}from"./T.BRLcDx1Y.js";import{i as Jt}from"./if.DuTJ8Uny.js";import{s as ei}from"./snippet.HBwHaGf9.js";import{d as ti,w as rt,p as ii,s as ni,a as oi,b as ri,r as ai}from"./props.CsgYfpMq.js";import"./branches.68xjZrll.js";function si(t,e){e&&ft(tt,{...pt(tt),[t]:e})}function ci(t,e,i){const n=Nt();if(!n)throw new Error("No user context store found, did you invoke this function outside of your main <Canvas> component?");return e?(n.update(o=>{if(t in o)return o;const r=typeof e=="function"?e():e;return o[t]=r,o}),n.current[t]):ti(n,o=>o[t])}const de=t=>({subscribe:t.subscribe,get current(){return t.current}});let ge=0;const Be=re(!1),je=re(!1),Xe=re(void 0),We=re(0),$e=re(0),yt=re([]),Ve=re(0),{onStart:li,onLoad:di,onError:hi}=De;De.onStart=(t,e,i)=>{li?.(t,e,i),je.set(!0),Xe.set(t),We.set(e),$e.set(i);const n=(e-ge)/(i-ge);Ve.set(n),n===1&&Be.set(!0)};De.onLoad=()=>{di?.(),je.set(!1)};De.onError=t=>{hi?.(t),yt.update(e=>[...e,t])};De.onProgress=(t,e,i)=>{e===i&&(ge=i),je.set(!0),Xe.set(t),We.set(e),$e.set(i);const n=(e-ge)/(i-ge)||1;Ve.set(n),n===1&&Be.set(!0)};de(je),de(Xe),de(We),de($e),de(yt),de(Ve),de(Be);new I;new I;new I;new Fe;new ye;new Ge;new I;new I;new ye;new I;new I;new Rt;new I;new I;new I;new Q;const ui="Right",fi="Top",pi="Front",vi="Left",mi="Bottom",_i="Back";[ui,fi,pi,vi,mi,_i].map(t=>t.toLocaleLowerCase());new Ae;new I;Ie.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new Q(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};zt.line={uniforms:Lt.merge([Ie.common,Ie.fog,Ie.line]),vertexShader:`
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
		`};new Me;new I;new I;new Me;new Me;new Me;new I;new ye;new Ut;new I;new Ae;new Fe;new Me;const at={type:"change"},Ke={type:"start"},gt={type:"end"},Oe=new Ge,st=new Yt,yi=Math.cos(70*Zt.DEG2RAD),Z=new I,te=2*Math.PI,A={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},ze=1e-6;let gi=class extends Ht{constructor(e,i=null){super(e,i),this.state=A.NONE,this.enabled=!0,this.target=new I,this.cursor=new I,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:_e.ROTATE,MIDDLE:_e.DOLLY,RIGHT:_e.PAN},this.touches={ONE:ve.ROTATE,TWO:ve.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new I,this._lastQuaternion=new it,this._lastTargetPosition=new I,this._quat=new it().setFromUnitVectors(e.up,new I(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new nt,this._sphericalDelta=new nt,this._scale=1,this._panOffset=new I,this._rotateStart=new Q,this._rotateEnd=new Q,this._rotateDelta=new Q,this._panStart=new Q,this._panEnd=new Q,this._panDelta=new Q,this._dollyStart=new Q,this._dollyEnd=new Q,this._dollyDelta=new Q,this._dollyDirection=new I,this._mouse=new Q,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=bi.bind(this),this._onPointerDown=xi.bind(this),this._onPointerUp=wi.bind(this),this._onContextMenu=Ci.bind(this),this._onMouseWheel=Pi.bind(this),this._onKeyDown=Si.bind(this),this._onTouchStart=Ei.bind(this),this._onTouchMove=Oi.bind(this),this._onMouseDown=Di.bind(this),this._onMouseMove=Mi.bind(this),this._interceptControlDown=Ti.bind(this),this._interceptControlUp=Ii.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(at),this.update(),this.state=A.NONE}update(e=null){const i=this.object.position;Z.copy(i).sub(this.target),Z.applyQuaternion(this._quat),this._spherical.setFromVector3(Z),this.autoRotate&&this.state===A.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,o=this.maxAzimuthAngle;isFinite(n)&&isFinite(o)&&(n<-Math.PI?n+=te:n>Math.PI&&(n-=te),o<-Math.PI?o+=te:o>Math.PI&&(o-=te),n<=o?this._spherical.theta=Math.max(n,Math.min(o,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+o)/2?Math.max(n,this._spherical.theta):Math.min(o,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(Z.setFromSpherical(this._spherical),Z.applyQuaternion(this._quatInverse),i.copy(this.target).add(Z),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const s=Z.length();a=this._clampDistance(s*this._scale);const c=s-a;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){const s=new I(this._mouse.x,this._mouse.y,0);s.unproject(this.object);const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;const l=new I(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(s),this.object.updateMatrixWorld(),a=Z.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Oe.origin.copy(this.object.position),Oe.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Oe.direction))<yi?this.object.lookAt(this.target):(st.setFromNormalAndCoplanarPoint(this.object.up,this.target),Oe.intersectPlane(st,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>ze||8*(1-this._lastQuaternion.dot(this.object.quaternion))>ze||this._lastTargetPosition.distanceToSquared(this.target)>ze?(this.dispatchEvent(at),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?te/60*this.autoRotateSpeed*e:te/60/60*this.autoRotateSpeed}_getZoomScale(e){const i=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*i)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,i){Z.setFromMatrixColumn(i,0),Z.multiplyScalar(-e),this._panOffset.add(Z)}_panUp(e,i){this.screenSpacePanning===!0?Z.setFromMatrixColumn(i,1):(Z.setFromMatrixColumn(i,0),Z.crossVectors(this.object.up,Z)),Z.multiplyScalar(e),this._panOffset.add(Z)}_pan(e,i){const n=this.domElement;if(this.object.isPerspectiveCamera){const o=this.object.position;Z.copy(o).sub(this.target);let r=Z.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*i*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(i*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,i){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),o=e-n.left,r=i-n.top,a=n.width,s=n.height;this._mouse.x=o/a*2-1,this._mouse.y=-(r/s)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const i=this.domElement;this._rotateLeft(te*this._rotateDelta.x/i.clientHeight),this._rotateUp(te*this._rotateDelta.y/i.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let i=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(te*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),i=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(-te*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),i=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(te*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),i=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(-te*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),i=!0;break}i&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),n=.5*(e.pageX+i.x),o=.5*(e.pageY+i.y);this._rotateStart.set(n,o)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),n=.5*(e.pageX+i.x),o=.5*(e.pageY+i.y);this._panStart.set(n,o)}}_handleTouchStartDolly(e){const i=this._getSecondPointerPosition(e),n=e.pageX-i.x,o=e.pageY-i.y,r=Math.sqrt(n*n+o*o);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),o=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(o,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const i=this.domElement;this._rotateLeft(te*this._rotateDelta.x/i.clientHeight),this._rotateUp(te*this._rotateDelta.y/i.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),n=.5*(e.pageX+i.x),o=.5*(e.pageY+i.y);this._panEnd.set(n,o)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const i=this._getSecondPointerPosition(e),n=e.pageX-i.x,o=e.pageY-i.y,r=Math.sqrt(n*n+o*o);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+i.x)*.5,s=(e.pageY+i.y)*.5;this._updateZoomParameters(a,s)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let i=0;i<this._pointers.length;i++)if(this._pointers[i]==e.pointerId){this._pointers.splice(i,1);return}}_isTrackingPointer(e){for(let i=0;i<this._pointers.length;i++)if(this._pointers[i]==e.pointerId)return!0;return!1}_trackPointer(e){let i=this._pointerPositions[e.pointerId];i===void 0&&(i=new Q,this._pointerPositions[e.pointerId]=i),i.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const i=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[i]}_customWheelEvent(e){const i=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(i){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function xi(t){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(t.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(t)&&(this._addPointer(t),t.pointerType==="touch"?this._onTouchStart(t):this._onMouseDown(t)))}function bi(t){this.enabled!==!1&&(t.pointerType==="touch"?this._onTouchMove(t):this._onMouseMove(t))}function wi(t){switch(this._removePointer(t),this._pointers.length){case 0:this.domElement.releasePointerCapture(t.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(gt),this.state=A.NONE;break;case 1:const e=this._pointers[0],i=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:i.x,pageY:i.y});break}}function Di(t){let e;switch(t.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case _e.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(t),this.state=A.DOLLY;break;case _e.ROTATE:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=A.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=A.ROTATE}break;case _e.PAN:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=A.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=A.PAN}break;default:this.state=A.NONE}this.state!==A.NONE&&this.dispatchEvent(Ke)}function Mi(t){switch(this.state){case A.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(t);break;case A.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(t);break;case A.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(t);break}}function Pi(t){this.enabled===!1||this.enableZoom===!1||this.state!==A.NONE||(t.preventDefault(),this.dispatchEvent(Ke),this._handleMouseWheel(this._customWheelEvent(t)),this.dispatchEvent(gt))}function Si(t){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(t)}function Ei(t){switch(this._trackPointer(t),this._pointers.length){case 1:switch(this.touches.ONE){case ve.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(t),this.state=A.TOUCH_ROTATE;break;case ve.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(t),this.state=A.TOUCH_PAN;break;default:this.state=A.NONE}break;case 2:switch(this.touches.TWO){case ve.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(t),this.state=A.TOUCH_DOLLY_PAN;break;case ve.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(t),this.state=A.TOUCH_DOLLY_ROTATE;break;default:this.state=A.NONE}break;default:this.state=A.NONE}this.state!==A.NONE&&this.dispatchEvent(Ke)}function Oi(t){switch(this._trackPointer(t),this.state){case A.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(t),this.update();break;case A.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(t),this.update();break;case A.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(t),this.update();break;case A.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(t),this.update();break;default:this.state=A.NONE}}function Ci(t){this.enabled!==!1&&t.preventDefault()}function Ti(t){t.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Ii(t){t.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const Ai=()=>ci("threlte-controls",{orbitControls:rt(void 0),trackballControls:rt(void 0)});function ji(t,e){Ye(e,!0);const i=()=>oi(s,"$parent",n),[n,o]=ri();let r=ii(e,"ref",15),a=ai(e,["$$slots","$$events","$$legacy","ref","children"]);const s=Ft(),{dom:c,invalidate:l}=vt();if(!mt(i(),"Camera"))throw new Error("Parent missing: <OrbitControls> need to be a child of a <Camera>");const d=new gi(i(),c),{orbitControls:v}=Ai();Gt(()=>{d.update()},{running:()=>e.autoRotate??e.enableDamping??!1}),Ct(()=>{const g=T=>{l(),e.onchange?.(T)};return v.set(d),d.addEventListener("change",g),()=>{v.set(void 0),d.removeEventListener("change",g)}}),_(t,ni({get is(){return d}},()=>a,{get ref(){return r()},set ref(g){r(g)},children:(g,T)=>{var M=Tt(),K=V(M);ei(K,()=>e.children??It,()=>({ref:d})),F(g,M)},$$slots:{default:!0}})),Ze(),o()}new ye;new ye;new Bt;`${ae.logdepthbuf_pars_vertex}${ae.fog_pars_vertex}${ae.logdepthbuf_vertex}${ae.fog_vertex}`;`${ae.tonemapping_fragment}${ae.colorspace_fragment}`;`${ae.tonemapping_fragment}${ae.colorspace_fragment}`;const ki=`

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
`,Ni=`

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
`,Ri=`
struct BVH {

	usampler2D index;
	sampler2D position;

	sampler2D bvhBounds;
	usampler2D bvhContents;

};
`,zi=Ri,Li=`
	${ki}
	${Ni}
`;`${zi}${Li}${ae.tonemapping_fragment}${ae.colorspace_fragment}`;new Ae;typeof window<"u"&&document.createElement("div");const Ui=t=>{const{camera:e}=vt();let i=t.current.clientWidth,n=t.current.clientHeight;const o=new ResizeObserver(([r])=>{i=r.contentRect.width,n=r.contentRect.height});return _t(t,r=>(r&&o.observe(r),()=>{r&&o.unobserve(r)})),(r,a)=>{a.pointer.update(s=>(s.set(r.offsetX/i*2-1,-(r.offsetY/n)*2+1),s)),a.raycaster.setFromCamera(a.pointer.current,e.current)}},xt=Symbol("interactivity-context"),Hi=()=>pt(xt),Yi=t=>{const e=re(Xt().dom),i={enabled:re(!0),pointer:re(new Q),pointerOverTarget:re(!1),lastEvent:void 0,raycaster:new Wt,initialClick:[0,0],initialHits:[],hovered:new Map,interactiveObjects:[],target:e,handlers:new WeakMap,compute:Ui(e),filter:t?.filter,addInteractiveObject:(n,o)=>{i.interactiveObjects.indexOf(n)>-1||(i.handlers.set(n,o),i.interactiveObjects.push(n))},removeInteractiveObject:n=>{const o=i.interactiveObjects.indexOf(n);i.interactiveObjects.splice(o,1),i.handlers.delete(n)}};return ft(xt,i),i},bt=()=>{const t=Hi();if(!t)throw new Error("No interactivity context found. Did you forget to implement interactivity()?");return t},ct=["onclick","oncontextmenu","ondblclick","onwheel","onpointerup","onpointerdown","onpointerover","onpointerout","onpointerenter","onpointerleave","onpointermove","onpointermissed"],Zi=()=>{si("interactivity",t=>{if(!mt(t.ref,"Object3D")||!Object.entries(t.props).some(([o,r])=>r!==void 0&&ct.includes(o)))return;const{addInteractiveObject:i,removeInteractiveObject:n}=bt();return $t.pre(()=>[t.ref],([o])=>(i(o,t.props),()=>{n(o)})),{pluginProps:ct}})};function lt(t){return`${(t.eventObject||t.object).uuid}|${t.index}|${t.instanceId}`}const dt=[["click",!1],["contextmenu",!1],["dblclick",!1],["wheel",!1],["pointerdown",!0],["pointerup",!0],["pointerleave",!0],["pointerenter",!0],["pointermove",!0],["pointercancel",!0]],Fi=t=>{const{handlers:e}=bt(),i=f=>{const x=f.offsetX-t.initialClick[0],h=f.offsetY-t.initialClick[1];return Math.round(Math.hypot(x,h))},n=f=>{if(t.hovered.size===0)return;const x=new Set;for(const h of f)x.add(lt(h));for(const[h,m]of t.hovered)if(!x.has(h)){const{eventObject:E}=m;t.hovered.delete(h);const k=e.get(E);if(k){const G={...m,intersections:f};k.onpointerout?.(G),k.onpointerleave?.(G)}}},o=()=>{if(!t.enabled.current)return[];const f=[],x=t.raycaster.intersectObjects(t.interactiveObjects,!0),h=t.filter===void 0?x:t.filter(x,t);for(const m of h){let E=m.object;for(;E;)e.has(E)&&f.push({...m,eventObject:E}),E=E.parent}return f},r=(f,x)=>{for(const h of x)e.get(h)?.onpointermissed?.(f)},a=()=>{t.pointerOverTarget.set(!1),n([])},s=()=>{t.pointerOverTarget.set(!0)},c=f=>{const x=f.type,h=x==="pointermove",m=x==="click"||x==="contextmenu"||x==="dblclick";t.compute(f,t);const E=o(),k=m?i(f):0;x==="pointerdown"&&(t.initialClick=[f.offsetX,f.offsetY],t.initialHits=E.map(z=>z.eventObject)),m&&E.length===0&&k<=2&&r(f,t.interactiveObjects),h&&n(E);let G=!1;e:for(const z of E){const B=e.get(z.eventObject);if(!B)continue;const H={stopped:G,...z,intersections:E,stopPropagation(){if(G=!0,H.stopped=!0,t.hovered.size>0&&Array.from(t.hovered.values()).some(L=>L.eventObject===z.eventObject)){const L=E.slice(0,E.indexOf(z));n([...L,z])}},camera:t.raycaster.camera,delta:k,nativeEvent:f,pointer:t.pointer.current,ray:t.raycaster.ray};if(h){if(B.onpointerover||B.onpointerenter||B.onpointerout||B.onpointerleave){const L=lt(H),ie=t.hovered.get(L);ie?ie.stopped&&H.stopPropagation():(t.hovered.set(L,H),B.onpointerover?.(H),B.onpointerenter?.(H))}B.onpointermove?.(H)}else B[`on${x}`]?(!m||t.initialHits.includes(z.eventObject))&&(r(f,t.interactiveObjects.filter(L=>!t.initialHits.includes(L))),B[`on${x}`]?.(H)):m&&t.initialHits.includes(z.eventObject)&&r(f,t.interactiveObjects.filter(L=>!t.initialHits.includes(L)));if(G)break e}};let l=0,d=null,v=-1/0,g=-1/0;const T=.25,M=f=>{Math.abs(f.offsetX-v)<T&&Math.abs(f.offsetY-g)<T||(v=f.offsetX,g=f.offsetY,d=f,l||(l=requestAnimationFrame(()=>{l=0,d&&(c(d),d=null)})))},K=f=>{for(const[x]of dt)x==="pointerleave"||x==="pointercancel"?f.removeEventListener(x,a):x==="pointermove"?f.removeEventListener(x,M):x==="pointerenter"?f.removeEventListener(x,s):f.removeEventListener(x,c)},J=f=>{for(const[x,h]of dt)x==="pointerleave"||x==="pointercancel"?f.addEventListener(x,a,{passive:h}):x==="pointermove"?f.addEventListener(x,M,{passive:h}):x==="pointerenter"?f.addEventListener(x,s,{passive:h}):f.addEventListener(x,c,{passive:h})};_t(t.target,f=>(f&&J(f),()=>{f&&K(f)}))},Gi=t=>{const e=Yi(t);return Zi(),Fi(e),e};for(let t=0;t<256;t++)(t<16?"0":"")+t.toString(16);new Vt(-1,1,1,-1,0,1);class Bi extends Kt{constructor(){super(),this.setAttribute("position",new ot([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ot([0,2,0,0,2,0],2))}}new Bi;var wt={exports:{}};wt.exports=ke;wt.exports.default=ke;function ke(t,e,i){i=i||2;var n=e&&e.length,o=n?e[0]*i:t.length,r=Dt(t,0,o,i,!0),a=[];if(!r||r.next===r.prev)return a;var s,c,l,d,v,g,T;if(n&&(r=Ki(t,e,r,i)),t.length>80*i){s=l=t[0],c=d=t[1];for(var M=i;M<o;M+=i)v=t[M],g=t[M+1],v<s&&(s=v),g<c&&(c=g),v>l&&(l=v),g>d&&(d=g);T=Math.max(l-s,d-c),T=T!==0?32767/T:0}return xe(r,a,i,s,c,T,0),a}function Dt(t,e,i,n,o){var r,a;if(o===He(t,e,i,n)>0)for(r=e;r<i;r+=n)a=ht(r,t[r],t[r+1],a);else for(r=i-n;r>=e;r-=n)a=ht(r,t[r],t[r+1],a);return a&&Ne(a,a.next)&&(we(a),a=a.next),a}function ue(t,e){if(!t)return t;e||(e=t);var i=t,n;do if(n=!1,!i.steiner&&(Ne(i,i.next)||R(i.prev,i,i.next)===0)){if(we(i),i=e=i.prev,i===i.next)break;n=!0}else i=i.next;while(n||i!==e);return e}function xe(t,e,i,n,o,r,a){if(t){!a&&r&&tn(t,n,o,r);for(var s=t,c,l;t.prev!==t.next;){if(c=t.prev,l=t.next,r?Wi(t,n,o,r):Xi(t)){e.push(c.i/i|0),e.push(t.i/i|0),e.push(l.i/i|0),we(t),t=l.next,s=l.next;continue}if(t=l,t===s){a?a===1?(t=$i(ue(t),e,i),xe(t,e,i,n,o,r,2)):a===2&&Vi(t,e,i,n,o,r):xe(ue(t),e,i,n,o,r,1);break}}}}function Xi(t){var e=t.prev,i=t,n=t.next;if(R(e,i,n)>=0)return!1;for(var o=e.x,r=i.x,a=n.x,s=e.y,c=i.y,l=n.y,d=o<r?o<a?o:a:r<a?r:a,v=s<c?s<l?s:l:c<l?c:l,g=o>r?o>a?o:a:r>a?r:a,T=s>c?s>l?s:l:c>l?c:l,M=n.next;M!==e;){if(M.x>=d&&M.x<=g&&M.y>=v&&M.y<=T&&me(o,s,r,c,a,l,M.x,M.y)&&R(M.prev,M,M.next)>=0)return!1;M=M.next}return!0}function Wi(t,e,i,n){var o=t.prev,r=t,a=t.next;if(R(o,r,a)>=0)return!1;for(var s=o.x,c=r.x,l=a.x,d=o.y,v=r.y,g=a.y,T=s<c?s<l?s:l:c<l?c:l,M=d<v?d<g?d:g:v<g?v:g,K=s>c?s>l?s:l:c>l?c:l,J=d>v?d>g?d:g:v>g?v:g,f=Le(T,M,e,i,n),x=Le(K,J,e,i,n),h=t.prevZ,m=t.nextZ;h&&h.z>=f&&m&&m.z<=x;){if(h.x>=T&&h.x<=K&&h.y>=M&&h.y<=J&&h!==o&&h!==a&&me(s,d,c,v,l,g,h.x,h.y)&&R(h.prev,h,h.next)>=0||(h=h.prevZ,m.x>=T&&m.x<=K&&m.y>=M&&m.y<=J&&m!==o&&m!==a&&me(s,d,c,v,l,g,m.x,m.y)&&R(m.prev,m,m.next)>=0))return!1;m=m.nextZ}for(;h&&h.z>=f;){if(h.x>=T&&h.x<=K&&h.y>=M&&h.y<=J&&h!==o&&h!==a&&me(s,d,c,v,l,g,h.x,h.y)&&R(h.prev,h,h.next)>=0)return!1;h=h.prevZ}for(;m&&m.z<=x;){if(m.x>=T&&m.x<=K&&m.y>=M&&m.y<=J&&m!==o&&m!==a&&me(s,d,c,v,l,g,m.x,m.y)&&R(m.prev,m,m.next)>=0)return!1;m=m.nextZ}return!0}function $i(t,e,i){var n=t;do{var o=n.prev,r=n.next.next;!Ne(o,r)&&Mt(o,n,n.next,r)&&be(o,r)&&be(r,o)&&(e.push(o.i/i|0),e.push(n.i/i|0),e.push(r.i/i|0),we(n),we(n.next),n=t=r),n=n.next}while(n!==t);return ue(n)}function Vi(t,e,i,n,o,r){var a=t;do{for(var s=a.next.next;s!==a.prev;){if(a.i!==s.i&&rn(a,s)){var c=Pt(a,s);a=ue(a,a.next),c=ue(c,c.next),xe(a,e,i,n,o,r,0),xe(c,e,i,n,o,r,0);return}s=s.next}a=a.next}while(a!==t)}function Ki(t,e,i,n){var o=[],r,a,s,c,l;for(r=0,a=e.length;r<a;r++)s=e[r]*n,c=r<a-1?e[r+1]*n:t.length,l=Dt(t,s,c,n,!1),l===l.next&&(l.steiner=!0),o.push(on(l));for(o.sort(qi),r=0;r<o.length;r++)i=Qi(o[r],i);return i}function qi(t,e){return t.x-e.x}function Qi(t,e){var i=Ji(t,e);if(!i)return e;var n=Pt(i,t);return ue(n,n.next),ue(i,i.next)}function Ji(t,e){var i=e,n=t.x,o=t.y,r=-1/0,a;do{if(o<=i.y&&o>=i.next.y&&i.next.y!==i.y){var s=i.x+(o-i.y)*(i.next.x-i.x)/(i.next.y-i.y);if(s<=n&&s>r&&(r=s,a=i.x<i.next.x?i:i.next,s===n))return a}i=i.next}while(i!==e);if(!a)return null;var c=a,l=a.x,d=a.y,v=1/0,g;i=a;do n>=i.x&&i.x>=l&&n!==i.x&&me(o<d?n:r,o,l,d,o<d?r:n,o,i.x,i.y)&&(g=Math.abs(o-i.y)/(n-i.x),be(i,t)&&(g<v||g===v&&(i.x>a.x||i.x===a.x&&en(a,i)))&&(a=i,v=g)),i=i.next;while(i!==c);return a}function en(t,e){return R(t.prev,t,e.prev)<0&&R(e.next,t,t.next)<0}function tn(t,e,i,n){var o=t;do o.z===0&&(o.z=Le(o.x,o.y,e,i,n)),o.prevZ=o.prev,o.nextZ=o.next,o=o.next;while(o!==t);o.prevZ.nextZ=null,o.prevZ=null,nn(o)}function nn(t){var e,i,n,o,r,a,s,c,l=1;do{for(i=t,t=null,r=null,a=0;i;){for(a++,n=i,s=0,e=0;e<l&&(s++,n=n.nextZ,!!n);e++);for(c=l;s>0||c>0&&n;)s!==0&&(c===0||!n||i.z<=n.z)?(o=i,i=i.nextZ,s--):(o=n,n=n.nextZ,c--),r?r.nextZ=o:t=o,o.prevZ=r,r=o;i=n}r.nextZ=null,l*=2}while(a>1);return t}function Le(t,e,i,n,o){return t=(t-i)*o|0,e=(e-n)*o|0,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t|e<<1}function on(t){var e=t,i=t;do(e.x<i.x||e.x===i.x&&e.y<i.y)&&(i=e),e=e.next;while(e!==t);return i}function me(t,e,i,n,o,r,a,s){return(o-a)*(e-s)>=(t-a)*(r-s)&&(t-a)*(n-s)>=(i-a)*(e-s)&&(i-a)*(r-s)>=(o-a)*(n-s)}function rn(t,e){return t.next.i!==e.i&&t.prev.i!==e.i&&!an(t,e)&&(be(t,e)&&be(e,t)&&sn(t,e)&&(R(t.prev,t,e.prev)||R(t,e.prev,e))||Ne(t,e)&&R(t.prev,t,t.next)>0&&R(e.prev,e,e.next)>0)}function R(t,e,i){return(e.y-t.y)*(i.x-e.x)-(e.x-t.x)*(i.y-e.y)}function Ne(t,e){return t.x===e.x&&t.y===e.y}function Mt(t,e,i,n){var o=Te(R(t,e,i)),r=Te(R(t,e,n)),a=Te(R(i,n,t)),s=Te(R(i,n,e));return!!(o!==r&&a!==s||o===0&&Ce(t,i,e)||r===0&&Ce(t,n,e)||a===0&&Ce(i,t,n)||s===0&&Ce(i,e,n))}function Ce(t,e,i){return e.x<=Math.max(t.x,i.x)&&e.x>=Math.min(t.x,i.x)&&e.y<=Math.max(t.y,i.y)&&e.y>=Math.min(t.y,i.y)}function Te(t){return t>0?1:t<0?-1:0}function an(t,e){var i=t;do{if(i.i!==t.i&&i.next.i!==t.i&&i.i!==e.i&&i.next.i!==e.i&&Mt(i,i.next,t,e))return!0;i=i.next}while(i!==t);return!1}function be(t,e){return R(t.prev,t,t.next)<0?R(t,e,t.next)>=0&&R(t,t.prev,e)>=0:R(t,e,t.prev)<0||R(t,t.next,e)<0}function sn(t,e){var i=t,n=!1,o=(t.x+e.x)/2,r=(t.y+e.y)/2;do i.y>r!=i.next.y>r&&i.next.y!==i.y&&o<(i.next.x-i.x)*(r-i.y)/(i.next.y-i.y)+i.x&&(n=!n),i=i.next;while(i!==t);return n}function Pt(t,e){var i=new Ue(t.i,t.x,t.y),n=new Ue(e.i,e.x,e.y),o=t.next,r=e.prev;return t.next=e,e.prev=t,i.next=o,o.prev=i,n.next=i,i.prev=n,r.next=n,n.prev=r,n}function ht(t,e,i,n){var o=new Ue(t,e,i);return n?(o.next=n.next,o.prev=n,n.next.prev=o,n.next=o):(o.prev=o,o.next=o),o}function we(t){t.next.prev=t.prev,t.prev.next=t.next,t.prevZ&&(t.prevZ.nextZ=t.nextZ),t.nextZ&&(t.nextZ.prevZ=t.prevZ)}function Ue(t,e,i){this.i=t,this.x=e,this.y=i,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}ke.deviation=function(t,e,i,n){var o=e&&e.length,r=o?e[0]*i:t.length,a=Math.abs(He(t,0,r,i));if(o)for(var s=0,c=e.length;s<c;s++){var l=e[s]*i,d=s<c-1?e[s+1]*i:t.length;a-=Math.abs(He(t,l,d,i))}var v=0;for(s=0;s<n.length;s+=3){var g=n[s]*i,T=n[s+1]*i,M=n[s+2]*i;v+=Math.abs((t[g]-t[M])*(t[T+1]-t[g+1])-(t[g]-t[T])*(t[M+1]-t[g+1]))}return a===0&&v===0?0:Math.abs((v-a)/a)};function He(t,e,i,n){for(var o=0,r=e,a=i-n;r<i;r+=n)o+=(t[a]-t[r])*(t[r+1]+t[a+1]),a=r;return o}ke.flatten=function(t){for(var e=t[0][0].length,i={vertices:[],holes:[],dimensions:e},n=0,o=0;o<t.length;o++){for(var r=0;r<t[o].length;r++)for(var a=0;a<e;a++)i.vertices.push(t[o][r][a]);o>0&&(n+=t[o-1].length,i.holes.push(n))}return i};new Q;new Q;var ut;(t=>{function e(o){let r=o.slice();return r.sort(t.POINT_COMPARATOR),t.makeHullPresorted(r)}t.makeHull=e;function i(o){if(o.length<=1)return o.slice();let r=[];for(let s=0;s<o.length;s++){const c=o[s];for(;r.length>=2;){const l=r[r.length-1],d=r[r.length-2];if((l.x-d.x)*(c.y-d.y)>=(l.y-d.y)*(c.x-d.x))r.pop();else break}r.push(c)}r.pop();let a=[];for(let s=o.length-1;s>=0;s--){const c=o[s];for(;a.length>=2;){const l=a[a.length-1],d=a[a.length-2];if((l.x-d.x)*(c.y-d.y)>=(l.y-d.y)*(c.x-d.x))a.pop();else break}a.push(c)}return a.pop(),r.length==1&&a.length==1&&r[0].x==a[0].x&&r[0].y==a[0].y?r:r.concat(a)}t.makeHullPresorted=i;function n(o,r){return o.x<r.x?-1:o.x>r.x?1:o.y<r.y?-1:o.y>r.y?1:0}t.POINT_COMPARATOR=n})(ut||(ut={}));new qt;new I;new ye;new Ge;new Fe;new Ae;new I;new I;var cn=$("<!> <!>",1),ln=$("<!> <!>",1),dn=$("<!> <!>",1),hn=$("<!> <!>",1),un=$("<!> <!>",1),fn=$("<!> <!>",1),pn=$("<!> <!>",1),vn=$("<!> <!>",1),mn=$("<!> <!>",1),_n=$("<!> <!>",1),yn=$("<!> <!>",1),gn=$("<!> <!>",1),xn=$("<!> <!>",1),bn=$("<!> <!>",1),wn=$("<!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!>",1),Dn=$("<!> <!> <!> <!> <!> <!> <!>",1);function Mn(t,e){Ye(e,!0),Gi();let i=pe(!1);const n=20,o=20,r="#374151",a="#1f2937",s=.04,c=.3,l=.12,d=.2,v="#facc15";var g=Dn(),T=V(g);y(T,()=>_.PerspectiveCamera,(E,k)=>{k(E,{makeDefault:!0,position:[8,6,8],fov:45,children:(G,z)=>{ji(G,{enableDamping:!0,dampingFactor:.05})},$$slots:{default:!0}})});var M=u(T,2);y(M,()=>_.AmbientLight,(E,k)=>{k(E,{intensity:.5})});var K=u(M,2);y(K,()=>_.DirectionalLight,(E,k)=>{k(E,{position:[5,10,5],intensity:1.2,castShadow:!0})});var J=u(K,2);y(J,()=>_.GridHelper,(E,k)=>{k(E,{args:[n,o,r,a],position:[0,0,0]})});var f=u(J,2);{let E=W(()=>[0,e.dimY/2,0]);y(f,()=>_.Mesh,(k,G)=>{G(k,{get position(){return D(E)},castShadow:!0,receiveShadow:!0,onclick:z=>{z.stopPropagation(),he(i,!D(i))},children:(z,B)=>{var H=cn(),L=V(H);{let ne=W(()=>[e.dimX,e.dimY,e.dimZ]);y(L,()=>_.BoxGeometry,(ee,oe)=>{oe(ee,{get args(){return D(ne)}})})}var ie=u(L,2);{let ne=W(()=>D(i)?"#86efac":"#4ade80");y(ie,()=>_.MeshStandardMaterial,(ee,oe)=>{oe(ee,{get color(){return D(ne)},metalness:.3,roughness:.5})})}F(z,H)},$$slots:{default:!0}})})}var x=u(f,2);{let E=W(()=>[0,e.dimY/2,0]);y(x,()=>_.Mesh,(k,G)=>{G(k,{get position(){return D(E)},children:(z,B)=>{var H=ln(),L=V(H);{let ne=W(()=>[e.dimX,e.dimY,e.dimZ]);y(L,()=>_.BoxGeometry,(ee,oe)=>{oe(ee,{get args(){return D(ne)}})})}var ie=u(L,2);y(ie,()=>_.MeshBasicMaterial,(ne,ee)=>{ee(ne,{color:"#166534",wireframe:!0})}),F(z,H)},$$slots:{default:!0}})})}var h=u(x,2);{var m=E=>{var k=wn(),G=V(k);{let N=W(()=>[e.dimX/2+c/2,e.dimY/2,0]);y(G,()=>_.Mesh,(j,O)=>{O(j,{get position(){return D(N)},rotation:[0,0,-Math.PI/2],onclick:b=>{b.stopPropagation(),e.onAdjustX?.(1)},children:(b,X)=>{var P=dn(),S=V(P);y(S,()=>_.CylinderGeometry,(p,w)=>{w(p,{args:[s,s,c,8]})});var C=u(S,2);y(C,()=>_.MeshStandardMaterial,(p,w)=>{w(p,{color:v})}),F(b,P)},$$slots:{default:!0}})})}var z=u(G,2);{let N=W(()=>[e.dimX/2+c+d/2,e.dimY/2,0]);y(z,()=>_.Mesh,(j,O)=>{O(j,{get position(){return D(N)},rotation:[0,0,-Math.PI/2],onclick:b=>{b.stopPropagation(),e.onAdjustX?.(1)},children:(b,X)=>{var P=hn(),S=V(P);y(S,()=>_.ConeGeometry,(p,w)=>{w(p,{args:[l,d,8]})});var C=u(S,2);y(C,()=>_.MeshStandardMaterial,(p,w)=>{w(p,{color:v})}),F(b,P)},$$slots:{default:!0}})})}var B=u(z,2);{let N=W(()=>[-e.dimX/2-c/2,e.dimY/2,0]);y(B,()=>_.Mesh,(j,O)=>{O(j,{get position(){return D(N)},rotation:[0,0,Math.PI/2],onclick:b=>{b.stopPropagation(),e.onAdjustX?.(-1)},children:(b,X)=>{var P=un(),S=V(P);y(S,()=>_.CylinderGeometry,(p,w)=>{w(p,{args:[s,s,c,8]})});var C=u(S,2);y(C,()=>_.MeshStandardMaterial,(p,w)=>{w(p,{color:v})}),F(b,P)},$$slots:{default:!0}})})}var H=u(B,2);{let N=W(()=>[-e.dimX/2-c-d/2,e.dimY/2,0]);y(H,()=>_.Mesh,(j,O)=>{O(j,{get position(){return D(N)},rotation:[0,0,Math.PI/2],onclick:b=>{b.stopPropagation(),e.onAdjustX?.(-1)},children:(b,X)=>{var P=fn(),S=V(P);y(S,()=>_.ConeGeometry,(p,w)=>{w(p,{args:[l,d,8]})});var C=u(S,2);y(C,()=>_.MeshStandardMaterial,(p,w)=>{w(p,{color:v})}),F(b,P)},$$slots:{default:!0}})})}var L=u(H,2);{let N=W(()=>[0,e.dimY+c/2,0]);y(L,()=>_.Mesh,(j,O)=>{O(j,{get position(){return D(N)},onclick:b=>{b.stopPropagation(),e.onAdjustY?.(1)},children:(b,X)=>{var P=pn(),S=V(P);y(S,()=>_.CylinderGeometry,(p,w)=>{w(p,{args:[s,s,c,8]})});var C=u(S,2);y(C,()=>_.MeshStandardMaterial,(p,w)=>{w(p,{color:v})}),F(b,P)},$$slots:{default:!0}})})}var ie=u(L,2);{let N=W(()=>[0,e.dimY+c+d/2,0]);y(ie,()=>_.Mesh,(j,O)=>{O(j,{get position(){return D(N)},onclick:b=>{b.stopPropagation(),e.onAdjustY?.(1)},children:(b,X)=>{var P=vn(),S=V(P);y(S,()=>_.ConeGeometry,(p,w)=>{w(p,{args:[l,d,8]})});var C=u(S,2);y(C,()=>_.MeshStandardMaterial,(p,w)=>{w(p,{color:v})}),F(b,P)},$$slots:{default:!0}})})}var ne=u(ie,2);y(ne,()=>_.Mesh,(N,j)=>{j(N,{position:[0,-c/2,0],rotation:[0,0,Math.PI],onclick:O=>{O.stopPropagation(),e.onAdjustY?.(-1)},children:(O,b)=>{var X=mn(),P=V(X);y(P,()=>_.CylinderGeometry,(C,p)=>{p(C,{args:[s,s,c,8]})});var S=u(P,2);y(S,()=>_.MeshStandardMaterial,(C,p)=>{p(C,{color:v})}),F(O,X)},$$slots:{default:!0}})});var ee=u(ne,2);y(ee,()=>_.Mesh,(N,j)=>{j(N,{position:[0,-c-d/2,0],rotation:[0,0,Math.PI],onclick:O=>{O.stopPropagation(),e.onAdjustY?.(-1)},children:(O,b)=>{var X=_n(),P=V(X);y(P,()=>_.ConeGeometry,(C,p)=>{p(C,{args:[l,d,8]})});var S=u(P,2);y(S,()=>_.MeshStandardMaterial,(C,p)=>{p(C,{color:v})}),F(O,X)},$$slots:{default:!0}})});var oe=u(ee,2);{let N=W(()=>[0,e.dimY/2,e.dimZ/2+c/2]);y(oe,()=>_.Mesh,(j,O)=>{O(j,{get position(){return D(N)},rotation:[Math.PI/2,0,0],onclick:b=>{b.stopPropagation(),e.onAdjustZ?.(1)},children:(b,X)=>{var P=yn(),S=V(P);y(S,()=>_.CylinderGeometry,(p,w)=>{w(p,{args:[s,s,c,8]})});var C=u(S,2);y(C,()=>_.MeshStandardMaterial,(p,w)=>{w(p,{color:v})}),F(b,P)},$$slots:{default:!0}})})}var Pe=u(oe,2);{let N=W(()=>[0,e.dimY/2,e.dimZ/2+c+d/2]);y(Pe,()=>_.Mesh,(j,O)=>{O(j,{get position(){return D(N)},rotation:[Math.PI/2,0,0],onclick:b=>{b.stopPropagation(),e.onAdjustZ?.(1)},children:(b,X)=>{var P=gn(),S=V(P);y(S,()=>_.ConeGeometry,(p,w)=>{w(p,{args:[l,d,8]})});var C=u(S,2);y(C,()=>_.MeshStandardMaterial,(p,w)=>{w(p,{color:v})}),F(b,P)},$$slots:{default:!0}})})}var fe=u(Pe,2);{let N=W(()=>[0,e.dimY/2,-e.dimZ/2-c/2]);y(fe,()=>_.Mesh,(j,O)=>{O(j,{get position(){return D(N)},rotation:[-Math.PI/2,0,0],onclick:b=>{b.stopPropagation(),e.onAdjustZ?.(-1)},children:(b,X)=>{var P=xn(),S=V(P);y(S,()=>_.CylinderGeometry,(p,w)=>{w(p,{args:[s,s,c,8]})});var C=u(S,2);y(C,()=>_.MeshStandardMaterial,(p,w)=>{w(p,{color:v})}),F(b,P)},$$slots:{default:!0}})})}var Se=u(fe,2);{let N=W(()=>[0,e.dimY/2,-e.dimZ/2-c-d/2]);y(Se,()=>_.Mesh,(j,O)=>{O(j,{get position(){return D(N)},rotation:[-Math.PI/2,0,0],onclick:b=>{b.stopPropagation(),e.onAdjustZ?.(-1)},children:(b,X)=>{var P=bn(),S=V(P);y(S,()=>_.ConeGeometry,(p,w)=>{w(p,{args:[l,d,8]})});var C=u(S,2);y(C,()=>_.MeshStandardMaterial,(p,w)=>{w(p,{color:v})}),F(b,P)},$$slots:{default:!0}})})}F(E,k)};Jt(h,E=>{D(i)&&E(m)})}F(t,g),Ze()}var Pn=$("<button> </button>"),Sn=$('<div class="flex flex-col gap-6 w-full"><div class="flex flex-wrap items-center gap-6"><div class="flex items-center gap-3"><span class="text-sm font-medium text-gray-400">Units:</span> <div class="flex rounded-lg overflow-hidden border border-gray-600"><button>mm</button> <button>in</button></div></div> <div class="flex items-center gap-3"><span class="text-sm font-medium text-gray-400">Step (mm):</span> <div class="flex rounded-lg overflow-hidden border border-gray-600"></div></div></div> <div class="relative w-full rounded-xl overflow-hidden border border-gray-700" style="height: 480px;"><!> <div class="absolute bottom-4 left-4 z-10 bg-gray-900/80 backdrop-blur-sm rounded-xl p-3 border border-gray-700 select-none"><p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Adjust</p> <div class="flex flex-col gap-2"><div class="flex items-center gap-2"><span class="w-20 text-xs text-gray-300">Width (X)</span> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Decrease width">←</button> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Increase width">→</button></div> <div class="flex items-center gap-2"><span class="w-20 text-xs text-gray-300">Height (Y)</span> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Decrease height">↓</button> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Increase height">↑</button></div> <div class="flex items-center gap-2"><span class="w-20 text-xs text-gray-300">Depth (Z)</span> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Decrease depth">←</button> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Increase depth">→</button></div></div></div> <div class="absolute bottom-4 right-4 z-10 bg-gray-900/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-700"><p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Dimensions</p> <div class="flex flex-col gap-1 font-mono text-sm"><div class="flex gap-3"><span class="text-gray-500 w-4">W</span> <span class="text-green-400"> </span></div> <div class="flex gap-3"><span class="text-gray-500 w-4">H</span> <span class="text-green-400"> </span></div> <div class="flex gap-3"><span class="text-gray-500 w-4">D</span> <span class="text-green-400"> </span></div></div></div></div></div>');function Ln(t,e){Ye(e,!0);const i=1/25,n=1/25.4,o=[.1,1,2.5,5,10];let r=pe(100),a=pe(12),s=pe(150),c=pe("mm"),l=pe(.1),d=W(()=>D(r)*i),v=W(()=>D(a)*i),g=W(()=>D(s)*i);function T(q){return D(c)==="in"?(q*n).toFixed(3):q.toFixed(1)}function M(q,le,se){return Math.max(le,Math.min(se,q))}function K(q){he(r,M(D(r)+D(l)*q,10,500),!0)}function J(q){he(a,M(D(a)+D(l)*q,1,200),!0)}function f(q){he(s,M(D(s)+D(l)*q,10,500),!0)}var x=Sn(),h=Y(x),m=Y(h),E=u(Y(m),2),k=Y(E),G=u(k,2);U(E),U(m);var z=u(m,2),B=u(Y(z),2);jt(B,21,()=>o,kt,(q,le)=>{var se=Pn(),Ot=Y(se,!0);U(se),et(()=>{Re(se,1,`px-3 py-1.5 text-sm font-semibold transition-colors ${D(l)===D(le)?"bg-green-500 text-white":"bg-gray-800 text-gray-400 hover:text-white"}`),Ee(Ot,D(le))}),ce("click",se,()=>he(l,D(le),!0)),F(q,se)}),U(B),U(z),U(h);var H=u(h,2),L=Y(H);Qt(L,{children:(q,le)=>{Mn(q,{get dimX(){return D(d)},get dimY(){return D(v)},get dimZ(){return D(g)},onAdjustX:K,onAdjustY:J,onAdjustZ:f})},$$slots:{default:!0}});var ie=u(L,2),ne=u(Y(ie),2),ee=Y(ne),oe=u(Y(ee),2),Pe=u(oe,2);U(ee);var fe=u(ee,2),Se=u(Y(fe),2),N=u(Se,2);U(fe);var j=u(fe,2),O=u(Y(j),2),b=u(O,2);U(j),U(ne),U(ie);var X=u(ie,2),P=u(Y(X),2),S=Y(P),C=u(Y(S),2),p=Y(C);U(C),U(S);var w=u(S,2),qe=u(Y(w),2),St=Y(qe);U(qe),U(w);var Qe=u(w,2),Je=u(Y(Qe),2),Et=Y(Je);U(Je),U(Qe),U(P),U(X),U(H),U(x),et((q,le,se)=>{Re(k,1,`px-4 py-1.5 text-sm font-semibold transition-colors ${D(c)==="mm"?"bg-green-500 text-white":"bg-gray-800 text-gray-400 hover:text-white"}`),Re(G,1,`px-4 py-1.5 text-sm font-semibold transition-colors ${D(c)==="in"?"bg-green-500 text-white":"bg-gray-800 text-gray-400 hover:text-white"}`),Ee(p,`${q??""} ${D(c)??""}`),Ee(St,`${le??""} ${D(c)??""}`),Ee(Et,`${se??""} ${D(c)??""}`)},[()=>T(D(r)),()=>T(D(a)),()=>T(D(s))]),ce("click",k,()=>he(c,"mm")),ce("click",G,()=>he(c,"in")),ce("click",oe,()=>K(-1)),ce("click",Pe,()=>K(1)),ce("click",Se,()=>J(-1)),ce("click",N,()=>J(1)),ce("click",O,()=>f(-1)),ce("click",b,()=>f(1)),F(t,x),Ze()}At(["click"]);export{Ln as default};
