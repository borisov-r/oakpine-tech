import"./disclose-version.DsnmJJEf.js";import{o as $t,q as Kt,p as ft,u as _n,c as yn,f as ie,v as gn,a as V,h as pt,w as xn,s as y,g as m,j as we,d as $,i as Q,x as J,t as st,e as R,r as N}from"./template.DtZfKPYR.js";import{d as bn,a as ve,s as be}from"./render.BTq1sVAA.js";import{i as ct}from"./if.Bnb4x8QM.js";import{e as wn,i as Dn}from"./each.DbAPb_14.js";import{s as Ze}from"./class.3jyHBqXt.js";import{d as Mn,w as zt,p as We,s as Sn,a as Pn,b as En,r as Cn}from"./props.LCskouTu.js";import{p as Rt,u as On,c as me,D as Re,V as A,S as vt,M as je,R as mt,O as Tn,a as oe,B as $e,U as Ve,b as An,d as In,e as Ue,L as jn,C as Ln,f as Ie,T as Te,Q as Ut,g as Ht,P as Nn,h as kn,i as zn,j as qt,k as Qt,l as Rn,m as b,n as Jt,o as _e,w as en,q as Un,r as Hn,s as Yn,t as Fn,v as Zn,F as Yt,x as Bn,y as D,z as Xn,A as Gn}from"./T.-shqGUd5.js";import{s as Wn}from"./snippet.2QqtCTMV.js";import"./branches.CNLIHHx7.js";function Vn(t,e){e&&$t(Rt,{...Kt(Rt),[t]:e})}function $n(t,e,n){const i=On();if(!i)throw new Error("No user context store found, did you invoke this function outside of your main <Canvas> component?");return e?(i.update(o=>{if(t in o)return o;const r=typeof e=="function"?e():e;return o[t]=r,o}),i.current[t]):Mn(i,o=>o[t])}const Se=t=>({subscribe:t.subscribe,get current(){return t.current}});let Le=0;const _t=me(!1),Ke=me(!1),yt=me(void 0),gt=me(0),xt=me(0),tn=me([]),bt=me(0),{onStart:Kn,onLoad:qn,onError:Qn}=Re;Re.onStart=(t,e,n)=>{Kn?.(t,e,n),Ke.set(!0),yt.set(t),gt.set(e),xt.set(n);const i=(e-Le)/(n-Le);bt.set(i),i===1&&_t.set(!0)};Re.onLoad=()=>{qn?.(),Ke.set(!1)};Re.onError=t=>{Qn?.(t),tn.update(e=>[...e,t])};Re.onProgress=(t,e,n)=>{e===n&&(Le=n),Ke.set(!0),yt.set(t),gt.set(e),xt.set(n);const i=(e-Le)/(n-Le)||1;bt.set(i),i===1&&_t.set(!0)};Se(Ke),Se(yt),Se(gt),Se(xt),Se(tn),Se(bt),Se(_t);new A;new A;new A;new vt;new je;new mt;new A;new A;new je;new A;new A;new Tn;new A;new A;new A;new oe;const Jn="Right",ei="Top",ti="Front",ni="Left",ii="Bottom",oi="Back";[Jn,ei,ti,ni,ii,oi].map(t=>t.toLocaleLowerCase());new $e;new A;Ve.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new oe(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};An.line={uniforms:In.merge([Ve.common,Ve.fog,Ve.line]),vertexShader:`
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
		`};new Ue;new A;new A;new Ue;new Ue;new Ue;new A;new je;new jn;new A;new $e;new vt;new Ue;const Ft={type:"change"},wt={type:"start"},nn={type:"end"},Be=new mt,Zt=new Nn,ri=Math.cos(70*kn.DEG2RAD),q=new A,le=2*Math.PI,k={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},lt=1e-6;let ai=class extends Ln{constructor(e,n=null){super(e,n),this.state=k.NONE,this.enabled=!0,this.target=new A,this.cursor=new A,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Ie.ROTATE,MIDDLE:Ie.DOLLY,RIGHT:Ie.PAN},this.touches={ONE:Te.ROTATE,TWO:Te.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new A,this._lastQuaternion=new Ut,this._lastTargetPosition=new A,this._quat=new Ut().setFromUnitVectors(e.up,new A(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Ht,this._sphericalDelta=new Ht,this._scale=1,this._panOffset=new A,this._rotateStart=new oe,this._rotateEnd=new oe,this._rotateDelta=new oe,this._panStart=new oe,this._panEnd=new oe,this._panDelta=new oe,this._dollyStart=new oe,this._dollyEnd=new oe,this._dollyDelta=new oe,this._dollyDirection=new A,this._mouse=new oe,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=li.bind(this),this._onPointerDown=si.bind(this),this._onPointerUp=ci.bind(this),this._onContextMenu=mi.bind(this),this._onMouseWheel=ui.bind(this),this._onKeyDown=fi.bind(this),this._onTouchStart=pi.bind(this),this._onTouchMove=vi.bind(this),this._onMouseDown=di.bind(this),this._onMouseMove=hi.bind(this),this._interceptControlDown=_i.bind(this),this._interceptControlUp=yi.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Ft),this.update(),this.state=k.NONE}update(e=null){const n=this.object.position;q.copy(n).sub(this.target),q.applyQuaternion(this._quat),this._spherical.setFromVector3(q),this.autoRotate&&this.state===k.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,o=this.maxAzimuthAngle;isFinite(i)&&isFinite(o)&&(i<-Math.PI?i+=le:i>Math.PI&&(i-=le),o<-Math.PI?o+=le:o>Math.PI&&(o-=le),i<=o?this._spherical.theta=Math.max(i,Math.min(o,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+o)/2?Math.max(i,this._spherical.theta):Math.min(o,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(q.setFromSpherical(this._spherical),q.applyQuaternion(this._quatInverse),n.copy(this.target).add(q),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const s=q.length();a=this._clampDistance(s*this._scale);const c=s-a;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){const s=new A(this._mouse.x,this._mouse.y,0);s.unproject(this.object);const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;const l=new A(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(s),this.object.updateMatrixWorld(),a=q.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Be.origin.copy(this.object.position),Be.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Be.direction))<ri?this.object.lookAt(this.target):(Zt.setFromNormalAndCoplanarPoint(this.object.up,this.target),Be.intersectPlane(Zt,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>lt||8*(1-this._lastQuaternion.dot(this.object.quaternion))>lt||this._lastTargetPosition.distanceToSquared(this.target)>lt?(this.dispatchEvent(Ft),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?le/60*this.autoRotateSpeed*e:le/60/60*this.autoRotateSpeed}_getZoomScale(e){const n=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*n)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,n){q.setFromMatrixColumn(n,0),q.multiplyScalar(-e),this._panOffset.add(q)}_panUp(e,n){this.screenSpacePanning===!0?q.setFromMatrixColumn(n,1):(q.setFromMatrixColumn(n,0),q.crossVectors(this.object.up,q)),q.multiplyScalar(e),this._panOffset.add(q)}_pan(e,n){const i=this.domElement;if(this.object.isPerspectiveCamera){const o=this.object.position;q.copy(o).sub(this.target);let r=q.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/i.clientHeight,this.object.matrix),this._panUp(2*n*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(n*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,n){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),o=e-i.left,r=n-i.top,a=i.width,s=i.height;this._mouse.x=o/a*2-1,this._mouse.y=-(r/s)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(le*this._rotateDelta.x/n.clientHeight),this._rotateUp(le*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let n=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(le*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),n=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(-le*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),n=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(le*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),n=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(-le*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),n=!0;break}n&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),o=.5*(e.pageY+n.y);this._rotateStart.set(i,o)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),o=.5*(e.pageY+n.y);this._panStart.set(i,o)}}_handleTouchStartDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,o=e.pageY-n.y,r=Math.sqrt(i*i+o*o);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),o=.5*(e.pageX+i.x),r=.5*(e.pageY+i.y);this._rotateEnd.set(o,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(le*this._rotateDelta.x/n.clientHeight),this._rotateUp(le*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),o=.5*(e.pageY+n.y);this._panEnd.set(i,o)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,o=e.pageY-n.y,r=Math.sqrt(i*i+o*o);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+n.x)*.5,s=(e.pageY+n.y)*.5;this._updateZoomParameters(a,s)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId){this._pointers.splice(n,1);return}}_isTrackingPointer(e){for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId)return!0;return!1}_trackPointer(e){let n=this._pointerPositions[e.pointerId];n===void 0&&(n=new oe,this._pointerPositions[e.pointerId]=n),n.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const n=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[n]}_customWheelEvent(e){const n=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(n){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}};function si(t){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(t.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(t)&&(this._addPointer(t),t.pointerType==="touch"?this._onTouchStart(t):this._onMouseDown(t)))}function li(t){this.enabled!==!1&&(t.pointerType==="touch"?this._onTouchMove(t):this._onMouseMove(t))}function ci(t){switch(this._removePointer(t),this._pointers.length){case 0:this.domElement.releasePointerCapture(t.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(nn),this.state=k.NONE;break;case 1:const e=this._pointers[0],n=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:n.x,pageY:n.y});break}}function di(t){let e;switch(t.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Ie.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(t),this.state=k.DOLLY;break;case Ie.ROTATE:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=k.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=k.ROTATE}break;case Ie.PAN:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=k.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=k.PAN}break;default:this.state=k.NONE}this.state!==k.NONE&&this.dispatchEvent(wt)}function hi(t){switch(this.state){case k.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(t);break;case k.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(t);break;case k.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(t);break}}function ui(t){this.enabled===!1||this.enableZoom===!1||this.state!==k.NONE||(t.preventDefault(),this.dispatchEvent(wt),this._handleMouseWheel(this._customWheelEvent(t)),this.dispatchEvent(nn))}function fi(t){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(t)}function pi(t){switch(this._trackPointer(t),this._pointers.length){case 1:switch(this.touches.ONE){case Te.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(t),this.state=k.TOUCH_ROTATE;break;case Te.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(t),this.state=k.TOUCH_PAN;break;default:this.state=k.NONE}break;case 2:switch(this.touches.TWO){case Te.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(t),this.state=k.TOUCH_DOLLY_PAN;break;case Te.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(t),this.state=k.TOUCH_DOLLY_ROTATE;break;default:this.state=k.NONE}break;default:this.state=k.NONE}this.state!==k.NONE&&this.dispatchEvent(wt)}function vi(t){switch(this._trackPointer(t),this.state){case k.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(t),this.update();break;case k.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(t),this.update();break;case k.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(t),this.update();break;case k.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(t),this.update();break;default:this.state=k.NONE}}function mi(t){this.enabled!==!1&&t.preventDefault()}function _i(t){t.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function yi(t){t.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const gi=()=>$n("threlte-controls",{orbitControls:zt(void 0),trackballControls:zt(void 0)});function xi(t,e){ft(e,!0);const n=()=>Pn(s,"$parent",i),[i,o]=En();let r=We(e,"ref",15),a=Cn(e,["$$slots","$$events","$$legacy","ref","children"]);const s=zn(),{dom:c,invalidate:l}=qt();if(!Qt(n(),"Camera"))throw new Error("Parent missing: <OrbitControls> need to be a child of a <Camera>");const v=new ai(n(),c),{orbitControls:g}=gi();Rn(()=>{v.update()},{running:()=>e.autoRotate??e.enableDamping??!1}),_n(()=>{const _=P=>{l(),e.onchange?.(P)};return g.set(v),v.addEventListener("change",_),()=>{g.set(void 0),v.removeEventListener("change",_)}}),b(t,Sn({get is(){return v}},()=>a,{get ref(){return r()},set ref(_){r(_)},children:(_,P)=>{var w=yn(),B=ie(w);Wn(B,()=>e.children??gn,()=>({ref:v})),V(_,w)},$$slots:{default:!0}})),pt(),o()}new je;new je;new Jt;`${_e.logdepthbuf_pars_vertex}${_e.fog_pars_vertex}${_e.logdepthbuf_vertex}${_e.fog_vertex}`;`${_e.tonemapping_fragment}${_e.colorspace_fragment}`;`${_e.tonemapping_fragment}${_e.colorspace_fragment}`;const bi=`

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
`,wi=`

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
`,Di=`
struct BVH {

	usampler2D index;
	sampler2D position;

	sampler2D bvhBounds;
	usampler2D bvhContents;

};
`,Mi=Di,Si=`
	${bi}
	${wi}
`;`${Mi}${Si}${_e.tonemapping_fragment}${_e.colorspace_fragment}`;new $e;typeof window<"u"&&document.createElement("div");const Pi=t=>{const{camera:e}=qt();let n=t.current.clientWidth,i=t.current.clientHeight;const o=new ResizeObserver(([r])=>{n=r.contentRect.width,i=r.contentRect.height});return en(t,r=>(r&&o.observe(r),()=>{r&&o.unobserve(r)})),(r,a)=>{a.pointer.update(s=>(s.set(r.offsetX/n*2-1,-(r.offsetY/i)*2+1),s)),a.raycaster.setFromCamera(a.pointer.current,e.current)}},on=Symbol("interactivity-context"),Ei=()=>Kt(on),Ci=t=>{const e=me(Un().dom),n={enabled:me(!0),pointer:me(new oe),pointerOverTarget:me(!1),lastEvent:void 0,raycaster:new Hn,initialClick:[0,0],initialHits:[],hovered:new Map,interactiveObjects:[],target:e,handlers:new WeakMap,compute:Pi(e),filter:t?.filter,addInteractiveObject:(i,o)=>{n.interactiveObjects.indexOf(i)>-1||(n.handlers.set(i,o),n.interactiveObjects.push(i))},removeInteractiveObject:i=>{const o=n.interactiveObjects.indexOf(i);n.interactiveObjects.splice(o,1),n.handlers.delete(i)}};return $t(on,n),n},rn=()=>{const t=Ei();if(!t)throw new Error("No interactivity context found. Did you forget to implement interactivity()?");return t},Bt=["onclick","oncontextmenu","ondblclick","onwheel","onpointerup","onpointerdown","onpointerover","onpointerout","onpointerenter","onpointerleave","onpointermove","onpointermissed"],Oi=()=>{Vn("interactivity",t=>{if(!Qt(t.ref,"Object3D")||!Object.entries(t.props).some(([o,r])=>r!==void 0&&Bt.includes(o)))return;const{addInteractiveObject:n,removeInteractiveObject:i}=rn();return Yn.pre(()=>[t.ref],([o])=>(n(o,t.props),()=>{i(o)})),{pluginProps:Bt}})};function Xt(t){return`${(t.eventObject||t.object).uuid}|${t.index}|${t.instanceId}`}const Gt=[["click",!1],["contextmenu",!1],["dblclick",!1],["wheel",!1],["pointerdown",!0],["pointerup",!0],["pointerleave",!0],["pointerenter",!0],["pointermove",!0],["pointercancel",!0]],Ti=t=>{const{handlers:e}=rn(),n=d=>{const f=d.offsetX-t.initialClick[0],h=d.offsetY-t.initialClick[1];return Math.round(Math.hypot(f,h))},i=d=>{if(t.hovered.size===0)return;const f=new Set;for(const h of d)f.add(Xt(h));for(const[h,u]of t.hovered)if(!f.has(h)){const{eventObject:T}=u;t.hovered.delete(h);const re=e.get(T);if(re){const I={...u,intersections:d};re.onpointerout?.(I),re.onpointerleave?.(I)}}},o=()=>{if(!t.enabled.current)return[];const d=[],f=t.raycaster.intersectObjects(t.interactiveObjects,!0),h=t.filter===void 0?f:t.filter(f,t);for(const u of h){let T=u.object;for(;T;)e.has(T)&&d.push({...u,eventObject:T}),T=T.parent}return d},r=(d,f)=>{for(const h of f)e.get(h)?.onpointermissed?.(d)},a=()=>{t.pointerOverTarget.set(!1),i([])},s=()=>{t.pointerOverTarget.set(!0)},c=d=>{const f=d.type,h=f==="pointermove",u=f==="click"||f==="contextmenu"||f==="dblclick";t.compute(d,t);const T=o(),re=u?n(d):0;f==="pointerdown"&&(t.initialClick=[d.offsetX,d.offsetY],t.initialHits=T.map(ee=>ee.eventObject)),u&&T.length===0&&re<=2&&r(d,t.interactiveObjects),h&&i(T);let I=!1;e:for(const ee of T){const K=e.get(ee.eventObject);if(!K)continue;const U={stopped:I,...ee,intersections:T,stopPropagation(){if(I=!0,U.stopped=!0,t.hovered.size>0&&Array.from(t.hovered.values()).some(ne=>ne.eventObject===ee.eventObject)){const ne=T.slice(0,T.indexOf(ee));i([...ne,ee])}},camera:t.raycaster.camera,delta:re,nativeEvent:d,pointer:t.pointer.current,ray:t.raycaster.ray};if(h){if(K.onpointerover||K.onpointerenter||K.onpointerout||K.onpointerleave){const ne=Xt(U),ye=t.hovered.get(ne);ye?ye.stopped&&U.stopPropagation():(t.hovered.set(ne,U),K.onpointerover?.(U),K.onpointerenter?.(U))}K.onpointermove?.(U)}else K[`on${f}`]?(!u||t.initialHits.includes(ee.eventObject))&&(r(d,t.interactiveObjects.filter(ne=>!t.initialHits.includes(ne))),K[`on${f}`]?.(U)):u&&t.initialHits.includes(ee.eventObject)&&r(d,t.interactiveObjects.filter(ne=>!t.initialHits.includes(ne)));if(I)break e}};let l=0,v=null,g=-1/0,_=-1/0;const P=.25,w=d=>{Math.abs(d.offsetX-g)<P&&Math.abs(d.offsetY-_)<P||(g=d.offsetX,_=d.offsetY,v=d,l||(l=requestAnimationFrame(()=>{l=0,v&&(c(v),v=null)})))},B=d=>{for(const[f]of Gt)f==="pointerleave"||f==="pointercancel"?d.removeEventListener(f,a):f==="pointermove"?d.removeEventListener(f,w):f==="pointerenter"?d.removeEventListener(f,s):d.removeEventListener(f,c)},G=d=>{for(const[f,h]of Gt)f==="pointerleave"||f==="pointercancel"?d.addEventListener(f,a,{passive:h}):f==="pointermove"?d.addEventListener(f,w,{passive:h}):f==="pointerenter"?d.addEventListener(f,s,{passive:h}):d.addEventListener(f,c,{passive:h})};en(t.target,d=>(d&&G(d),()=>{d&&B(d)}))},Ai=t=>{const e=Ci(t);return Oi(),Ti(e),e};for(let t=0;t<256;t++)(t<16?"0":"")+t.toString(16);new Fn(-1,1,1,-1,0,1);class Ii extends Zn{constructor(){super(),this.setAttribute("position",new Yt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Yt([0,2,0,0,2,0],2))}}new Ii;var an={exports:{}};an.exports=qe;an.exports.default=qe;function qe(t,e,n){n=n||2;var i=e&&e.length,o=i?e[0]*n:t.length,r=sn(t,0,o,n,!0),a=[];if(!r||r.next===r.prev)return a;var s,c,l,v,g,_,P;if(i&&(r=zi(t,e,r,n)),t.length>80*n){s=l=t[0],c=v=t[1];for(var w=n;w<o;w+=n)g=t[w],_=t[w+1],g<s&&(s=g),_<c&&(c=_),g>l&&(l=g),_>v&&(v=_);P=Math.max(l-s,v-c),P=P!==0?32767/P:0}return Ne(r,a,n,s,c,P,0),a}function sn(t,e,n,i,o){var r,a;if(o===ut(t,e,n,i)>0)for(r=e;r<n;r+=i)a=Wt(r,t[r],t[r+1],a);else for(r=n-i;r>=e;r-=i)a=Wt(r,t[r],t[r+1],a);return a&&Qe(a,a.next)&&(ze(a),a=a.next),a}function Pe(t,e){if(!t)return t;e||(e=t);var n=t,i;do if(i=!1,!n.steiner&&(Qe(n,n.next)||X(n.prev,n,n.next)===0)){if(ze(n),n=e=n.prev,n===n.next)break;i=!0}else n=n.next;while(i||n!==e);return e}function Ne(t,e,n,i,o,r,a){if(t){!a&&r&&Fi(t,i,o,r);for(var s=t,c,l;t.prev!==t.next;){if(c=t.prev,l=t.next,r?Li(t,i,o,r):ji(t)){e.push(c.i/n|0),e.push(t.i/n|0),e.push(l.i/n|0),ze(t),t=l.next,s=l.next;continue}if(t=l,t===s){a?a===1?(t=Ni(Pe(t),e,n),Ne(t,e,n,i,o,r,2)):a===2&&ki(t,e,n,i,o,r):Ne(Pe(t),e,n,i,o,r,1);break}}}}function ji(t){var e=t.prev,n=t,i=t.next;if(X(e,n,i)>=0)return!1;for(var o=e.x,r=n.x,a=i.x,s=e.y,c=n.y,l=i.y,v=o<r?o<a?o:a:r<a?r:a,g=s<c?s<l?s:l:c<l?c:l,_=o>r?o>a?o:a:r>a?r:a,P=s>c?s>l?s:l:c>l?c:l,w=i.next;w!==e;){if(w.x>=v&&w.x<=_&&w.y>=g&&w.y<=P&&Ae(o,s,r,c,a,l,w.x,w.y)&&X(w.prev,w,w.next)>=0)return!1;w=w.next}return!0}function Li(t,e,n,i){var o=t.prev,r=t,a=t.next;if(X(o,r,a)>=0)return!1;for(var s=o.x,c=r.x,l=a.x,v=o.y,g=r.y,_=a.y,P=s<c?s<l?s:l:c<l?c:l,w=v<g?v<_?v:_:g<_?g:_,B=s>c?s>l?s:l:c>l?c:l,G=v>g?v>_?v:_:g>_?g:_,d=dt(P,w,e,n,i),f=dt(B,G,e,n,i),h=t.prevZ,u=t.nextZ;h&&h.z>=d&&u&&u.z<=f;){if(h.x>=P&&h.x<=B&&h.y>=w&&h.y<=G&&h!==o&&h!==a&&Ae(s,v,c,g,l,_,h.x,h.y)&&X(h.prev,h,h.next)>=0||(h=h.prevZ,u.x>=P&&u.x<=B&&u.y>=w&&u.y<=G&&u!==o&&u!==a&&Ae(s,v,c,g,l,_,u.x,u.y)&&X(u.prev,u,u.next)>=0))return!1;u=u.nextZ}for(;h&&h.z>=d;){if(h.x>=P&&h.x<=B&&h.y>=w&&h.y<=G&&h!==o&&h!==a&&Ae(s,v,c,g,l,_,h.x,h.y)&&X(h.prev,h,h.next)>=0)return!1;h=h.prevZ}for(;u&&u.z<=f;){if(u.x>=P&&u.x<=B&&u.y>=w&&u.y<=G&&u!==o&&u!==a&&Ae(s,v,c,g,l,_,u.x,u.y)&&X(u.prev,u,u.next)>=0)return!1;u=u.nextZ}return!0}function Ni(t,e,n){var i=t;do{var o=i.prev,r=i.next.next;!Qe(o,r)&&ln(o,i,i.next,r)&&ke(o,r)&&ke(r,o)&&(e.push(o.i/n|0),e.push(i.i/n|0),e.push(r.i/n|0),ze(i),ze(i.next),i=t=r),i=i.next}while(i!==t);return Pe(i)}function ki(t,e,n,i,o,r){var a=t;do{for(var s=a.next.next;s!==a.prev;){if(a.i!==s.i&&Xi(a,s)){var c=cn(a,s);a=Pe(a,a.next),c=Pe(c,c.next),Ne(a,e,n,i,o,r,0),Ne(c,e,n,i,o,r,0);return}s=s.next}a=a.next}while(a!==t)}function zi(t,e,n,i){var o=[],r,a,s,c,l;for(r=0,a=e.length;r<a;r++)s=e[r]*i,c=r<a-1?e[r+1]*i:t.length,l=sn(t,s,c,i,!1),l===l.next&&(l.steiner=!0),o.push(Bi(l));for(o.sort(Ri),r=0;r<o.length;r++)n=Ui(o[r],n);return n}function Ri(t,e){return t.x-e.x}function Ui(t,e){var n=Hi(t,e);if(!n)return e;var i=cn(n,t);return Pe(i,i.next),Pe(n,n.next)}function Hi(t,e){var n=e,i=t.x,o=t.y,r=-1/0,a;do{if(o<=n.y&&o>=n.next.y&&n.next.y!==n.y){var s=n.x+(o-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(s<=i&&s>r&&(r=s,a=n.x<n.next.x?n:n.next,s===i))return a}n=n.next}while(n!==e);if(!a)return null;var c=a,l=a.x,v=a.y,g=1/0,_;n=a;do i>=n.x&&n.x>=l&&i!==n.x&&Ae(o<v?i:r,o,l,v,o<v?r:i,o,n.x,n.y)&&(_=Math.abs(o-n.y)/(i-n.x),ke(n,t)&&(_<g||_===g&&(n.x>a.x||n.x===a.x&&Yi(a,n)))&&(a=n,g=_)),n=n.next;while(n!==c);return a}function Yi(t,e){return X(t.prev,t,e.prev)<0&&X(e.next,t,t.next)<0}function Fi(t,e,n,i){var o=t;do o.z===0&&(o.z=dt(o.x,o.y,e,n,i)),o.prevZ=o.prev,o.nextZ=o.next,o=o.next;while(o!==t);o.prevZ.nextZ=null,o.prevZ=null,Zi(o)}function Zi(t){var e,n,i,o,r,a,s,c,l=1;do{for(n=t,t=null,r=null,a=0;n;){for(a++,i=n,s=0,e=0;e<l&&(s++,i=i.nextZ,!!i);e++);for(c=l;s>0||c>0&&i;)s!==0&&(c===0||!i||n.z<=i.z)?(o=n,n=n.nextZ,s--):(o=i,i=i.nextZ,c--),r?r.nextZ=o:t=o,o.prevZ=r,r=o;n=i}r.nextZ=null,l*=2}while(a>1);return t}function dt(t,e,n,i,o){return t=(t-n)*o|0,e=(e-i)*o|0,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t|e<<1}function Bi(t){var e=t,n=t;do(e.x<n.x||e.x===n.x&&e.y<n.y)&&(n=e),e=e.next;while(e!==t);return n}function Ae(t,e,n,i,o,r,a,s){return(o-a)*(e-s)>=(t-a)*(r-s)&&(t-a)*(i-s)>=(n-a)*(e-s)&&(n-a)*(r-s)>=(o-a)*(i-s)}function Xi(t,e){return t.next.i!==e.i&&t.prev.i!==e.i&&!Gi(t,e)&&(ke(t,e)&&ke(e,t)&&Wi(t,e)&&(X(t.prev,t,e.prev)||X(t,e.prev,e))||Qe(t,e)&&X(t.prev,t,t.next)>0&&X(e.prev,e,e.next)>0)}function X(t,e,n){return(e.y-t.y)*(n.x-e.x)-(e.x-t.x)*(n.y-e.y)}function Qe(t,e){return t.x===e.x&&t.y===e.y}function ln(t,e,n,i){var o=Ge(X(t,e,n)),r=Ge(X(t,e,i)),a=Ge(X(n,i,t)),s=Ge(X(n,i,e));return!!(o!==r&&a!==s||o===0&&Xe(t,n,e)||r===0&&Xe(t,i,e)||a===0&&Xe(n,t,i)||s===0&&Xe(n,e,i))}function Xe(t,e,n){return e.x<=Math.max(t.x,n.x)&&e.x>=Math.min(t.x,n.x)&&e.y<=Math.max(t.y,n.y)&&e.y>=Math.min(t.y,n.y)}function Ge(t){return t>0?1:t<0?-1:0}function Gi(t,e){var n=t;do{if(n.i!==t.i&&n.next.i!==t.i&&n.i!==e.i&&n.next.i!==e.i&&ln(n,n.next,t,e))return!0;n=n.next}while(n!==t);return!1}function ke(t,e){return X(t.prev,t,t.next)<0?X(t,e,t.next)>=0&&X(t,t.prev,e)>=0:X(t,e,t.prev)<0||X(t,t.next,e)<0}function Wi(t,e){var n=t,i=!1,o=(t.x+e.x)/2,r=(t.y+e.y)/2;do n.y>r!=n.next.y>r&&n.next.y!==n.y&&o<(n.next.x-n.x)*(r-n.y)/(n.next.y-n.y)+n.x&&(i=!i),n=n.next;while(n!==t);return i}function cn(t,e){var n=new ht(t.i,t.x,t.y),i=new ht(e.i,e.x,e.y),o=t.next,r=e.prev;return t.next=e,e.prev=t,n.next=o,o.prev=n,i.next=n,n.prev=i,r.next=i,i.prev=r,i}function Wt(t,e,n,i){var o=new ht(t,e,n);return i?(o.next=i.next,o.prev=i,i.next.prev=o,i.next=o):(o.prev=o,o.next=o),o}function ze(t){t.next.prev=t.prev,t.prev.next=t.next,t.prevZ&&(t.prevZ.nextZ=t.nextZ),t.nextZ&&(t.nextZ.prevZ=t.prevZ)}function ht(t,e,n){this.i=t,this.x=e,this.y=n,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}qe.deviation=function(t,e,n,i){var o=e&&e.length,r=o?e[0]*n:t.length,a=Math.abs(ut(t,0,r,n));if(o)for(var s=0,c=e.length;s<c;s++){var l=e[s]*n,v=s<c-1?e[s+1]*n:t.length;a-=Math.abs(ut(t,l,v,n))}var g=0;for(s=0;s<i.length;s+=3){var _=i[s]*n,P=i[s+1]*n,w=i[s+2]*n;g+=Math.abs((t[_]-t[w])*(t[P+1]-t[_+1])-(t[_]-t[P])*(t[w+1]-t[_+1]))}return a===0&&g===0?0:Math.abs((g-a)/a)};function ut(t,e,n,i){for(var o=0,r=e,a=n-i;r<n;r+=i)o+=(t[a]-t[r])*(t[r+1]+t[a+1]),a=r;return o}qe.flatten=function(t){for(var e=t[0][0].length,n={vertices:[],holes:[],dimensions:e},i=0,o=0;o<t.length;o++){for(var r=0;r<t[o].length;r++)for(var a=0;a<e;a++)n.vertices.push(t[o][r][a]);o>0&&(i+=t[o-1].length,n.holes.push(i))}return n};new oe;new oe;var Vt;(t=>{function e(o){let r=o.slice();return r.sort(t.POINT_COMPARATOR),t.makeHullPresorted(r)}t.makeHull=e;function n(o){if(o.length<=1)return o.slice();let r=[];for(let s=0;s<o.length;s++){const c=o[s];for(;r.length>=2;){const l=r[r.length-1],v=r[r.length-2];if((l.x-v.x)*(c.y-v.y)>=(l.y-v.y)*(c.x-v.x))r.pop();else break}r.push(c)}r.pop();let a=[];for(let s=o.length-1;s>=0;s--){const c=o[s];for(;a.length>=2;){const l=a[a.length-1],v=a[a.length-2];if((l.x-v.x)*(c.y-v.y)>=(l.y-v.y)*(c.x-v.x))a.pop();else break}a.push(c)}return a.pop(),r.length==1&&a.length==1&&r[0].x==a[0].x&&r[0].y==a[0].y?r:r.concat(a)}t.makeHullPresorted=n;function i(o,r){return o.x<r.x?-1:o.x>r.x?1:o.y<r.y?-1:o.y>r.y?1:0}t.POINT_COMPARATOR=i})(Vt||(Vt={}));new Bn;new A;new je;new mt;new vt;new $e;new A;new A;var Vi=$("<!> <!>",1),$i=$("<!> <!>",1),Ki=$("<!> <!>",1),qi=$("<!> <!>",1),Qi=$("<!> <!>",1),Ji=$("<!> <!>",1),eo=$("<!> <!>",1),to=$("<!> <!>",1),no=$("<!> <!>",1),io=$("<!> <!>",1),oo=$("<!> <!>",1),ro=$("<!> <!>",1),ao=$("<!> <!>",1),so=$("<!> <!>",1),lo=$("<!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!>",1),co=$("<!> <!> <!> <!> <!> <!> <!>",1);function ho(t,e){ft(e,!0),Ai();let n=we(!1),i=we(!0);const o=20,r=20,a="#374151",s="#1f2937",c=.04,l=.3,v=.12,g=.2,_="#facc15",P=20;let w=!1,B,G="x",d=0,f=0,h=!1;function u(Z,H,W){W.stopPropagation(),Z&&(w=!0,B=Z,G=H,h=!1,f=0,d=H==="x"?W.event?.clientX??0:W.event?.clientY??0,Q(i,!1),document.addEventListener("pointermove",T),document.addEventListener("pointerup",re,{once:!0}))}function T(Z){if(!w)return;const H=G==="x"?Z.clientX:Z.clientY,W=H-d;d=H;const ce=G==="y"?-W:W;for(f+=ce;f>=P;)B?.(1),f-=P,h=!0;for(;f<=-P;)B?.(-1),f+=P,h=!0}function re(){w=!1,B=void 0,Q(i,!0),document.removeEventListener("pointermove",T)}function I(Z,H,W){if(h){h=!1;return}Z.stopPropagation(),H?.(W)}xn(()=>()=>{document.removeEventListener("pointermove",T)});var ee=co(),K=ie(ee);D(K,()=>b.PerspectiveCamera,(Z,H)=>{H(Z,{makeDefault:!0,position:[8,6,8],fov:45,children:(W,ce)=>{xi(W,{enableDamping:!0,dampingFactor:.05,get enabled(){return m(i)}})},$$slots:{default:!0}})});var U=y(K,2);D(U,()=>b.AmbientLight,(Z,H)=>{H(Z,{intensity:.5})});var ne=y(U,2);D(ne,()=>b.DirectionalLight,(Z,H)=>{H(Z,{position:[5,10,5],intensity:1.2,castShadow:!0})});var ye=y(ne,2);D(ye,()=>b.GridHelper,(Z,H)=>{H(Z,{args:[o,r,a,s],position:[0,0,0]})});var Ee=y(ye,2);{let Z=J(()=>[0,e.dimY/2,0]);D(Ee,()=>b.Mesh,(H,W)=>{W(H,{get position(){return m(Z)},castShadow:!0,receiveShadow:!0,onclick:ce=>{ce.stopPropagation(),Q(n,!m(n))},children:(ce,De)=>{var he=Vi(),ue=ie(he);{let ae=J(()=>[e.dimX,e.dimY,e.dimZ]);D(ue,()=>b.BoxGeometry,(de,fe)=>{fe(de,{get args(){return m(ae)}})})}var ge=y(ue,2);{let ae=J(()=>m(n)?"#86efac":"#4ade80");D(ge,()=>b.MeshStandardMaterial,(de,fe)=>{fe(de,{get color(){return m(ae)},metalness:.3,roughness:.5})})}V(ce,he)},$$slots:{default:!0}})})}var Ce=y(Ee,2);{let Z=J(()=>[0,e.dimY/2,0]);D(Ce,()=>b.Mesh,(H,W)=>{W(H,{get position(){return m(Z)},children:(ce,De)=>{var he=$i(),ue=ie(he);{let ae=J(()=>[e.dimX,e.dimY,e.dimZ]);D(ue,()=>b.BoxGeometry,(de,fe)=>{fe(de,{get args(){return m(ae)}})})}var ge=y(ue,2);D(ge,()=>b.MeshBasicMaterial,(ae,de)=>{de(ae,{color:"#166534",wireframe:!0})}),V(ce,he)},$$slots:{default:!0}})})}var He=y(Ce,2);{var Je=Z=>{var H=lo(),W=ie(H);{let Y=J(()=>[e.dimX/2+l/2,e.dimY/2,0]);D(W,()=>b.Mesh,(F,O)=>{O(F,{get position(){return m(Y)},rotation:[0,0,-Math.PI/2],onclick:p=>I(p,e.onAdjustX,1),onpointerdown:p=>u(e.onAdjustX,"x",p),children:(p,te)=>{var E=Ki(),C=ie(E);D(C,()=>b.CylinderGeometry,(x,M)=>{M(x,{args:[c,c,l,8]})});var L=y(C,2);D(L,()=>b.MeshStandardMaterial,(x,M)=>{M(x,{color:_})}),V(p,E)},$$slots:{default:!0}})})}var ce=y(W,2);{let Y=J(()=>[e.dimX/2+l+g/2,e.dimY/2,0]);D(ce,()=>b.Mesh,(F,O)=>{O(F,{get position(){return m(Y)},rotation:[0,0,-Math.PI/2],onclick:p=>I(p,e.onAdjustX,1),onpointerdown:p=>u(e.onAdjustX,"x",p),children:(p,te)=>{var E=qi(),C=ie(E);D(C,()=>b.ConeGeometry,(x,M)=>{M(x,{args:[v,g,8]})});var L=y(C,2);D(L,()=>b.MeshStandardMaterial,(x,M)=>{M(x,{color:_})}),V(p,E)},$$slots:{default:!0}})})}var De=y(ce,2);{let Y=J(()=>[-e.dimX/2-l/2,e.dimY/2,0]);D(De,()=>b.Mesh,(F,O)=>{O(F,{get position(){return m(Y)},rotation:[0,0,Math.PI/2],onclick:p=>I(p,e.onAdjustX,-1),onpointerdown:p=>u(e.onAdjustX,"x",p),children:(p,te)=>{var E=Qi(),C=ie(E);D(C,()=>b.CylinderGeometry,(x,M)=>{M(x,{args:[c,c,l,8]})});var L=y(C,2);D(L,()=>b.MeshStandardMaterial,(x,M)=>{M(x,{color:_})}),V(p,E)},$$slots:{default:!0}})})}var he=y(De,2);{let Y=J(()=>[-e.dimX/2-l-g/2,e.dimY/2,0]);D(he,()=>b.Mesh,(F,O)=>{O(F,{get position(){return m(Y)},rotation:[0,0,Math.PI/2],onclick:p=>I(p,e.onAdjustX,-1),onpointerdown:p=>u(e.onAdjustX,"x",p),children:(p,te)=>{var E=Ji(),C=ie(E);D(C,()=>b.ConeGeometry,(x,M)=>{M(x,{args:[v,g,8]})});var L=y(C,2);D(L,()=>b.MeshStandardMaterial,(x,M)=>{M(x,{color:_})}),V(p,E)},$$slots:{default:!0}})})}var ue=y(he,2);{let Y=J(()=>[0,e.dimY+l/2,0]);D(ue,()=>b.Mesh,(F,O)=>{O(F,{get position(){return m(Y)},onclick:p=>I(p,e.onAdjustY,1),onpointerdown:p=>u(e.onAdjustY,"y",p),children:(p,te)=>{var E=eo(),C=ie(E);D(C,()=>b.CylinderGeometry,(x,M)=>{M(x,{args:[c,c,l,8]})});var L=y(C,2);D(L,()=>b.MeshStandardMaterial,(x,M)=>{M(x,{color:_})}),V(p,E)},$$slots:{default:!0}})})}var ge=y(ue,2);{let Y=J(()=>[0,e.dimY+l+g/2,0]);D(ge,()=>b.Mesh,(F,O)=>{O(F,{get position(){return m(Y)},onclick:p=>I(p,e.onAdjustY,1),onpointerdown:p=>u(e.onAdjustY,"y",p),children:(p,te)=>{var E=to(),C=ie(E);D(C,()=>b.ConeGeometry,(x,M)=>{M(x,{args:[v,g,8]})});var L=y(C,2);D(L,()=>b.MeshStandardMaterial,(x,M)=>{M(x,{color:_})}),V(p,E)},$$slots:{default:!0}})})}var ae=y(ge,2);D(ae,()=>b.Mesh,(Y,F)=>{F(Y,{position:[0,-l/2,0],rotation:[0,0,Math.PI],onclick:O=>I(O,e.onAdjustY,-1),onpointerdown:O=>u(e.onAdjustY,"y",O),children:(O,p)=>{var te=no(),E=ie(te);D(E,()=>b.CylinderGeometry,(L,x)=>{x(L,{args:[c,c,l,8]})});var C=y(E,2);D(C,()=>b.MeshStandardMaterial,(L,x)=>{x(L,{color:_})}),V(O,te)},$$slots:{default:!0}})});var de=y(ae,2);D(de,()=>b.Mesh,(Y,F)=>{F(Y,{position:[0,-l-g/2,0],rotation:[0,0,Math.PI],onclick:O=>I(O,e.onAdjustY,-1),onpointerdown:O=>u(e.onAdjustY,"y",O),children:(O,p)=>{var te=io(),E=ie(te);D(E,()=>b.ConeGeometry,(L,x)=>{x(L,{args:[v,g,8]})});var C=y(E,2);D(C,()=>b.MeshStandardMaterial,(L,x)=>{x(L,{color:_})}),V(O,te)},$$slots:{default:!0}})});var fe=y(de,2);{let Y=J(()=>[0,e.dimY/2,e.dimZ/2+l/2]);D(fe,()=>b.Mesh,(F,O)=>{O(F,{get position(){return m(Y)},rotation:[Math.PI/2,0,0],onclick:p=>I(p,e.onAdjustZ,1),onpointerdown:p=>u(e.onAdjustZ,"x",p),children:(p,te)=>{var E=oo(),C=ie(E);D(C,()=>b.CylinderGeometry,(x,M)=>{M(x,{args:[c,c,l,8]})});var L=y(C,2);D(L,()=>b.MeshStandardMaterial,(x,M)=>{M(x,{color:_})}),V(p,E)},$$slots:{default:!0}})})}var Oe=y(fe,2);{let Y=J(()=>[0,e.dimY/2,e.dimZ/2+l+g/2]);D(Oe,()=>b.Mesh,(F,O)=>{O(F,{get position(){return m(Y)},rotation:[Math.PI/2,0,0],onclick:p=>I(p,e.onAdjustZ,1),onpointerdown:p=>u(e.onAdjustZ,"x",p),children:(p,te)=>{var E=ro(),C=ie(E);D(C,()=>b.ConeGeometry,(x,M)=>{M(x,{args:[v,g,8]})});var L=y(C,2);D(L,()=>b.MeshStandardMaterial,(x,M)=>{M(x,{color:_})}),V(p,E)},$$slots:{default:!0}})})}var Ye=y(Oe,2);{let Y=J(()=>[0,e.dimY/2,-e.dimZ/2-l/2]);D(Ye,()=>b.Mesh,(F,O)=>{O(F,{get position(){return m(Y)},rotation:[-Math.PI/2,0,0],onclick:p=>I(p,e.onAdjustZ,-1),onpointerdown:p=>u(e.onAdjustZ,"x",p),children:(p,te)=>{var E=ao(),C=ie(E);D(C,()=>b.CylinderGeometry,(x,M)=>{M(x,{args:[c,c,l,8]})});var L=y(C,2);D(L,()=>b.MeshStandardMaterial,(x,M)=>{M(x,{color:_})}),V(p,E)},$$slots:{default:!0}})})}var Fe=y(Ye,2);{let Y=J(()=>[0,e.dimY/2,-e.dimZ/2-l-g/2]);D(Fe,()=>b.Mesh,(F,O)=>{O(F,{get position(){return m(Y)},rotation:[-Math.PI/2,0,0],onclick:p=>I(p,e.onAdjustZ,-1),onpointerdown:p=>u(e.onAdjustZ,"x",p),children:(p,te)=>{var E=so(),C=ie(E);D(C,()=>b.ConeGeometry,(x,M)=>{M(x,{args:[v,g,8]})});var L=y(C,2);D(L,()=>b.MeshStandardMaterial,(x,M)=>{M(x,{color:_})}),V(p,E)},$$slots:{default:!0}})})}V(Z,H)};ct(He,Z=>{m(n)&&Z(Je)})}V(t,ee),pt()}class uo{parse(e,n={}){n=Object.assign({binary:!1},n);const i=n.binary,o=[];let r=0;e.traverse(function(d){if(d.isMesh){const f=d.geometry,h=f.index,u=f.getAttribute("position");r+=h!==null?h.count/3:u.count/3,o.push({object3d:d,geometry:f})}});let a,s=80;if(i===!0){const d=r*2+r*3*4*4+80+4,f=new ArrayBuffer(d);a=new DataView(f),a.setUint32(s,r,!0),s+=4}else a="",a+=`solid exported
`;const c=new A,l=new A,v=new A,g=new A,_=new A,P=new A;for(let d=0,f=o.length;d<f;d++){const h=o[d].object3d,u=o[d].geometry,T=u.index,re=u.getAttribute("position");if(T!==null)for(let I=0;I<T.count;I+=3){const ee=T.getX(I+0),K=T.getX(I+1),U=T.getX(I+2);w(ee,K,U,re,h)}else for(let I=0;I<re.count;I+=3){const ee=I+0,K=I+1,U=I+2;w(ee,K,U,re,h)}}return i===!1&&(a+=`endsolid exported
`),a;function w(d,f,h,u,T){c.fromBufferAttribute(u,d),l.fromBufferAttribute(u,f),v.fromBufferAttribute(u,h),T.isSkinnedMesh===!0&&(T.applyBoneTransform(d,c),T.applyBoneTransform(f,l),T.applyBoneTransform(h,v)),c.applyMatrix4(T.matrixWorld),l.applyMatrix4(T.matrixWorld),v.applyMatrix4(T.matrixWorld),B(c,l,v),G(c),G(l),G(v),i===!0?(a.setUint16(s,0,!0),s+=2):(a+=`		endloop
`,a+=`	endfacet
`)}function B(d,f,h){g.subVectors(h,f),_.subVectors(d,f),g.cross(_).normalize(),P.copy(g).normalize(),i===!0?(a.setFloat32(s,P.x,!0),s+=4,a.setFloat32(s,P.y,!0),s+=4,a.setFloat32(s,P.z,!0),s+=4):(a+="	facet normal "+P.x+" "+P.y+" "+P.z+`
`,a+=`		outer loop
`)}function G(d){i===!0?(a.setFloat32(s,d.x,!0),s+=4,a.setFloat32(s,d.y,!0),s+=4,a.setFloat32(s,d.z,!0),s+=4):a+="			vertex "+d.x+" "+d.y+" "+d.z+`
`}}}var fo=$("<button> </button>"),po=$('<button class="ml-3 underline opacity-70 hover:opacity-100">Dismiss</button>'),vo=$("<div> <!></div>"),mo=$('<div class="flex flex-col gap-6 w-full"><div class="flex flex-wrap items-center gap-6"><div class="flex items-center gap-3"><span class="text-sm font-medium text-gray-400">Units:</span> <div class="flex rounded-lg overflow-hidden border border-gray-600"><button>mm</button> <button>in</button></div></div> <div class="flex items-center gap-3"><span class="text-sm font-medium text-gray-400"> </span> <div class="flex rounded-lg overflow-hidden border border-gray-600"></div></div> <div class="flex items-center gap-3 ml-auto"><button class="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors" title="Export 3D model as STL file"><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg> Download STL</button> <button class="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors" title="Upload STL, metadata and preview to Nextcloud"><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd"></path></svg> </button></div></div> <!> <div class="flex flex-wrap gap-4 text-xs font-mono text-gray-500"><span> </span> <span>|</span> <span> </span></div> <div class="relative w-full rounded-xl overflow-hidden border border-gray-700" style="height: 480px;"><!> <div class="absolute bottom-4 left-4 z-10 bg-gray-900/80 backdrop-blur-sm rounded-xl p-3 border border-gray-700 select-none"><p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Adjust</p> <div class="flex flex-col gap-2"><div class="flex items-center gap-2"><span class="w-20 text-xs text-gray-300">Width (X)</span> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Decrease width">←</button> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Increase width">→</button></div> <div class="flex items-center gap-2"><span class="w-20 text-xs text-gray-300">Height (Y)</span> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Decrease height">↓</button> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Increase height">↑</button></div> <div class="flex items-center gap-2"><span class="w-20 text-xs text-gray-300">Length (Z)</span> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Decrease length">←</button> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Increase length">→</button></div></div></div> <div class="absolute bottom-4 right-4 z-10 bg-gray-900/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-700"><p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Dimensions</p> <div class="flex flex-col gap-1 font-mono text-sm"><div class="flex gap-3"><span class="text-gray-500 w-4">W</span> <span class="text-green-400"> </span></div> <div class="flex gap-3"><span class="text-gray-500 w-4">L</span> <span class="text-green-400"> </span></div> <div class="flex gap-3"><span class="text-gray-500 w-4">H</span> <span class="text-green-400"> </span></div></div></div></div></div>');function Co(t,e){ft(e,!0);let n=We(e,"nextcloudServer",3,""),i=We(e,"cncUser",3,""),o=We(e,"cncPassword",3,"");const r=1/25,a=1/25.4,s=[.1,1,2.5,5,10],c=100,l=950,v=100,g=1200,_=10,P=150;let w=we(310),B=we(405),G=we(120),d=we("mm"),f=we(1),h=we("idle"),u=we("");const T={idle:"",uploading:"bg-blue-900/40 border-blue-700 text-blue-300",success:"bg-green-900/40 border-green-700 text-green-300",error:"bg-red-900/40 border-red-700 text-red-300"};let re=J(()=>T[m(h)]),I=J(()=>m(w)*r),ee=J(()=>m(G)*r),K=J(()=>m(B)*r);function U(S){return m(d)==="in"?(S*a).toFixed(3):S.toFixed(1)}function ne(S,z,j){return Math.max(z,Math.min(j,S))}function ye(S){Q(w,ne(m(w)+m(f)*S,c,l),!0)}function Ee(S){Q(G,ne(m(G)+m(f)*S,_,P),!0)}function Ce(S){Q(B,ne(m(B)+m(f)*S,v,g),!0)}function He(){const S=new Gn(m(w),m(G),m(B)),z=new Jt(S);return new uo().parse(z,{binary:!0})}function Je(){const S=He(),z=new Blob([S.buffer],{type:"application/octet-stream"}),j=URL.createObjectURL(z),se=document.createElement("a");se.href=j,se.download="model.stl",document.body.appendChild(se),se.click(),document.body.removeChild(se),URL.revokeObjectURL(j)}function Z(){return new Promise(S=>{const z=document.querySelector("canvas");if(!z){S(null);return}z.toBlob(j=>S(j),"image/png")})}async function H(S,z){const j=await fetch(S,{method:"MKCOL",headers:{Authorization:z}});if(!j.ok&&j.status!==405)throw new Error(`MKCOL ${S} → ${j.status} ${j.statusText}`)}async function W(S,z,j,se){const pe=await fetch(S,{method:"PUT",headers:{Authorization:j,"Content-Type":se},body:z});if(!pe.ok)throw new Error(`PUT ${S} → ${pe.status} ${pe.statusText}`)}async function ce(){if(!n()||!i()||!o()){Q(h,"error"),Q(u,"Nextcloud credentials are not configured (NEXTCLOUD_WEBDAV_SERVER, CNC_APP_USER, CNC_APP_PASSWORD).");return}Q(h,"uploading"),Q(u,"Uploading to Nextcloud…");try{let S=localStorage.getItem("oakpine_user_id");S||(S="USER_"+Date.now(),localStorage.setItem("oakpine_user_id",S));const z="Project_"+crypto.randomUUID(),j="Basic "+btoa(`${i()}:${o()}`),pe=`${n().replace(/\/$/,"")+"/remote.php/dav/files/"+i()}/CNC-Projects`,Me=`${pe}/${S}`,xe=`${Me}/${z}`;await H(pe,j),await H(Me,j),await H(xe,j);const rt=He();await W(`${xe}/model.stl`,rt.buffer,j,"application/octet-stream");const at={created_at:new Date().toISOString(),dimensions:{width_mm:m(w),length_mm:m(B),height_mm:m(G)},limits:{min:{width_mm:c,length_mm:v,height_mm:_},max:{width_mm:l,length_mm:g,height_mm:P}},unit:m(d)};await W(`${xe}/metadata.json`,JSON.stringify(at,null,2),j,"application/json");const kt=await Z();kt&&await W(`${xe}/preview.png`,kt,j,"image/png"),Q(h,"success"),Q(u,`Uploaded to /CNC-Projects/${S}/${z}`)}catch(S){Q(h,"error"),Q(u,S instanceof Error?S.message:"Upload failed",!0)}}var De=mo(),he=R(De),ue=R(he),ge=y(R(ue),2),ae=R(ge),de=y(ae,2);N(ge),N(ue);var fe=y(ue,2),Oe=R(fe),Ye=R(Oe);N(Oe);var Fe=y(Oe,2);wn(Fe,21,()=>s,Dn,(S,z)=>{var j=fo(),se=R(j,!0);N(j),st(pe=>{Ze(j,1,`px-3 py-1.5 text-sm font-semibold transition-colors ${m(f)===m(z)?"bg-green-500 text-white":"bg-gray-800 text-gray-400 hover:text-white"}`),be(se,pe)},[()=>U(m(z))]),ve("click",j,()=>Q(f,m(z),!0)),V(S,j)}),N(Fe),N(fe);var Y=y(fe,2),F=R(Y),O=y(F,2),p=y(R(O));N(O),N(Y),N(he);var te=y(he,2);{var E=S=>{var z=vo(),j=R(z),se=y(j);{var pe=Me=>{var xe=po();ve("click",xe,()=>{Q(h,"idle"),Q(u,"")}),V(Me,xe)};ct(se,Me=>{m(h)!=="uploading"&&Me(pe)})}N(z),st(()=>{Ze(z,1,`rounded-lg px-4 py-3 text-sm font-medium border ${m(re)??""}`),be(j,`${m(u)??""} `)}),V(S,z)};ct(te,S=>{m(h)!=="idle"&&S(E)})}var C=y(te,2),L=R(C),x=R(L);N(L);var M=y(L,4),dn=R(M);N(M),N(C);var Dt=y(C,2),Mt=R(Dt);Xn(Mt,{children:(S,z)=>{ho(S,{get dimX(){return m(I)},get dimY(){return m(ee)},get dimZ(){return m(K)},onAdjustX:ye,onAdjustY:Ee,onAdjustZ:Ce})},$$slots:{default:!0}});var et=y(Mt,2),St=y(R(et),2),tt=R(St),Pt=y(R(tt),2),hn=y(Pt,2);N(tt);var nt=y(tt,2),Et=y(R(nt),2),un=y(Et,2);N(nt);var Ct=y(nt,2),Ot=y(R(Ct),2),fn=y(Ot,2);N(Ct),N(St),N(et);var Tt=y(et,2),At=y(R(Tt),2),it=R(At),It=y(R(it),2),pn=R(It);N(It),N(it);var ot=y(it,2),jt=y(R(ot),2),vn=R(jt);N(jt),N(ot);var Lt=y(ot,2),Nt=y(R(Lt),2),mn=R(Nt);N(Nt),N(Lt),N(At),N(Tt),N(Dt),N(De),st((S,z,j,se,pe,Me,xe,rt,at)=>{Ze(ae,1,`px-4 py-1.5 text-sm font-semibold transition-colors ${m(d)==="mm"?"bg-green-500 text-white":"bg-gray-800 text-gray-400 hover:text-white"}`),Ze(de,1,`px-4 py-1.5 text-sm font-semibold transition-colors ${m(d)==="in"?"bg-green-500 text-white":"bg-gray-800 text-gray-400 hover:text-white"}`),be(Ye,`Step (${m(d)??""}):`),O.disabled=m(h)==="uploading",be(p,` ${m(h)==="uploading"?"Uploading…":"Manufacture"}`),be(x,`Min: ${S??""} × ${z??""} × ${j??""} ${m(d)??""}  (W × L × H)`),be(dn,`Max: ${se??""} × ${pe??""} × ${Me??""} ${m(d)??""}  (W × L × H)`),be(pn,`${xe??""} ${m(d)??""}`),be(vn,`${rt??""} ${m(d)??""}`),be(mn,`${at??""} ${m(d)??""}`)},[()=>U(c),()=>U(v),()=>U(_),()=>U(l),()=>U(g),()=>U(P),()=>U(m(w)),()=>U(m(B)),()=>U(m(G))]),ve("click",ae,()=>Q(d,"mm")),ve("click",de,()=>Q(d,"in")),ve("click",F,Je),ve("click",O,ce),ve("click",Pt,()=>ye(-1)),ve("click",hn,()=>ye(1)),ve("click",Et,()=>Ee(-1)),ve("click",un,()=>Ee(1)),ve("click",Ot,()=>Ce(-1)),ve("click",fn,()=>Ce(1)),V(t,De),pt()}bn(["click"]);export{Co as default};
