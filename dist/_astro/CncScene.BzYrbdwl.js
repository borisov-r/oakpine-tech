import"./disclose-version.DsnmJJEf.js";import{o as Bt,q as Xt,p as dt,u as fn,h as pn,i as ie,v as vn,a as W,b as ht,w as mn,d as m,g as y,e as ge,f as V,s as J,x as ee,t as ot,c as F,r as Y}from"./template.C4tWkZGb.js";import{d as _n,a as pe,s as Ce}from"./render.D1p6ZZTq.js";import{i as at}from"./if.BFCGVVN2.js";import{e as yn,i as gn}from"./each.BQPasJCA.js";import{s as Ze}from"./class.CycsNbJG.js";import{d as xn,w as It,p as We,s as bn,a as wn,b as Dn,r as Mn}from"./props.Dv6ScJEH.js";import{p as jt,u as Sn,c as ve,D as Ue,V as A,S as ut,M as Ie,R as ft,O as Pn,a as oe,B as Ke,U as Ve,b as En,d as Cn,e as He,L as On,C as Tn,f as Ae,T as Oe,Q as Lt,g as Nt,P as An,h as In,i as jn,j as Gt,k as Wt,l as Ln,m as b,n as Vt,o as me,w as Kt,q as Nn,r as kn,s as zn,t as Rn,v as Un,F as kt,x as Hn,y as D,z as Yn,A as Fn}from"./T.MaVQFx4G.js";import{s as Zn}from"./snippet.B29E2ke9.js";import"./branches.LbBkNxWr.js";function Bn(t,e){e&&Bt(jt,{...Xt(jt),[t]:e})}function Xn(t,e,n){const i=Sn();if(!i)throw new Error("No user context store found, did you invoke this function outside of your main <Canvas> component?");return e?(i.update(o=>{if(t in o)return o;const r=typeof e=="function"?e():e;return o[t]=r,o}),i.current[t]):xn(i,o=>o[t])}const De=t=>({subscribe:t.subscribe,get current(){return t.current}});let Ne=0;const pt=ve(!1),$e=ve(!1),vt=ve(void 0),mt=ve(0),_t=ve(0),$t=ve([]),yt=ve(0),{onStart:Gn,onLoad:Wn,onError:Vn}=Ue;Ue.onStart=(t,e,n)=>{Gn?.(t,e,n),$e.set(!0),vt.set(t),mt.set(e),_t.set(n);const i=(e-Ne)/(n-Ne);yt.set(i),i===1&&pt.set(!0)};Ue.onLoad=()=>{Wn?.(),$e.set(!1)};Ue.onError=t=>{Vn?.(t),$t.update(e=>[...e,t])};Ue.onProgress=(t,e,n)=>{e===n&&(Ne=n),$e.set(!0),vt.set(t),mt.set(e),_t.set(n);const i=(e-Ne)/(n-Ne)||1;yt.set(i),i===1&&pt.set(!0)};De($e),De(vt),De(mt),De(_t),De($t),De(yt),De(pt);new A;new A;new A;new ut;new Ie;new ft;new A;new A;new Ie;new A;new A;new Pn;new A;new A;new A;new oe;const Kn="Right",$n="Top",qn="Front",Qn="Left",Jn="Bottom",ei="Back";[Kn,$n,qn,Qn,Jn,ei].map(t=>t.toLocaleLowerCase());new Ke;new A;Ve.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new oe(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};En.line={uniforms:Cn.merge([Ve.common,Ve.fog,Ve.line]),vertexShader:`
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
		`};new He;new A;new A;new He;new He;new He;new A;new Ie;new On;new A;new Ke;new ut;new He;const zt={type:"change"},gt={type:"start"},qt={type:"end"},Be=new ft,Rt=new An,ti=Math.cos(70*In.DEG2RAD),Q=new A,se=2*Math.PI,k={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},rt=1e-6;let ni=class extends Tn{constructor(e,n=null){super(e,n),this.state=k.NONE,this.enabled=!0,this.target=new A,this.cursor=new A,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Ae.ROTATE,MIDDLE:Ae.DOLLY,RIGHT:Ae.PAN},this.touches={ONE:Oe.ROTATE,TWO:Oe.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new A,this._lastQuaternion=new Lt,this._lastTargetPosition=new A,this._quat=new Lt().setFromUnitVectors(e.up,new A(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Nt,this._sphericalDelta=new Nt,this._scale=1,this._panOffset=new A,this._rotateStart=new oe,this._rotateEnd=new oe,this._rotateDelta=new oe,this._panStart=new oe,this._panEnd=new oe,this._panDelta=new oe,this._dollyStart=new oe,this._dollyEnd=new oe,this._dollyDelta=new oe,this._dollyDirection=new A,this._mouse=new oe,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=oi.bind(this),this._onPointerDown=ii.bind(this),this._onPointerUp=ri.bind(this),this._onContextMenu=ui.bind(this),this._onMouseWheel=li.bind(this),this._onKeyDown=ci.bind(this),this._onTouchStart=di.bind(this),this._onTouchMove=hi.bind(this),this._onMouseDown=ai.bind(this),this._onMouseMove=si.bind(this),this._interceptControlDown=fi.bind(this),this._interceptControlUp=pi.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(zt),this.update(),this.state=k.NONE}update(e=null){const n=this.object.position;Q.copy(n).sub(this.target),Q.applyQuaternion(this._quat),this._spherical.setFromVector3(Q),this.autoRotate&&this.state===k.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,o=this.maxAzimuthAngle;isFinite(i)&&isFinite(o)&&(i<-Math.PI?i+=se:i>Math.PI&&(i-=se),o<-Math.PI?o+=se:o>Math.PI&&(o-=se),i<=o?this._spherical.theta=Math.max(i,Math.min(o,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+o)/2?Math.max(i,this._spherical.theta):Math.min(o,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(Q.setFromSpherical(this._spherical),Q.applyQuaternion(this._quatInverse),n.copy(this.target).add(Q),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const s=Q.length();a=this._clampDistance(s*this._scale);const c=s-a;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){const s=new A(this._mouse.x,this._mouse.y,0);s.unproject(this.object);const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;const l=new A(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(s),this.object.updateMatrixWorld(),a=Q.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Be.origin.copy(this.object.position),Be.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Be.direction))<ti?this.object.lookAt(this.target):(Rt.setFromNormalAndCoplanarPoint(this.object.up,this.target),Be.intersectPlane(Rt,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>rt||8*(1-this._lastQuaternion.dot(this.object.quaternion))>rt||this._lastTargetPosition.distanceToSquared(this.target)>rt?(this.dispatchEvent(zt),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?se/60*this.autoRotateSpeed*e:se/60/60*this.autoRotateSpeed}_getZoomScale(e){const n=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*n)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,n){Q.setFromMatrixColumn(n,0),Q.multiplyScalar(-e),this._panOffset.add(Q)}_panUp(e,n){this.screenSpacePanning===!0?Q.setFromMatrixColumn(n,1):(Q.setFromMatrixColumn(n,0),Q.crossVectors(this.object.up,Q)),Q.multiplyScalar(e),this._panOffset.add(Q)}_pan(e,n){const i=this.domElement;if(this.object.isPerspectiveCamera){const o=this.object.position;Q.copy(o).sub(this.target);let r=Q.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/i.clientHeight,this.object.matrix),this._panUp(2*n*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(n*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,n){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),o=e-i.left,r=n-i.top,a=i.width,s=i.height;this._mouse.x=o/a*2-1,this._mouse.y=-(r/s)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(se*this._rotateDelta.x/n.clientHeight),this._rotateUp(se*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let n=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(se*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),n=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(-se*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),n=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(se*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),n=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(-se*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),n=!0;break}n&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),o=.5*(e.pageY+n.y);this._rotateStart.set(i,o)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),o=.5*(e.pageY+n.y);this._panStart.set(i,o)}}_handleTouchStartDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,o=e.pageY-n.y,r=Math.sqrt(i*i+o*o);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),o=.5*(e.pageX+i.x),r=.5*(e.pageY+i.y);this._rotateEnd.set(o,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(se*this._rotateDelta.x/n.clientHeight),this._rotateUp(se*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),o=.5*(e.pageY+n.y);this._panEnd.set(i,o)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,o=e.pageY-n.y,r=Math.sqrt(i*i+o*o);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+n.x)*.5,s=(e.pageY+n.y)*.5;this._updateZoomParameters(a,s)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId){this._pointers.splice(n,1);return}}_isTrackingPointer(e){for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId)return!0;return!1}_trackPointer(e){let n=this._pointerPositions[e.pointerId];n===void 0&&(n=new oe,this._pointerPositions[e.pointerId]=n),n.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const n=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[n]}_customWheelEvent(e){const n=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(n){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}};function ii(t){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(t.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(t)&&(this._addPointer(t),t.pointerType==="touch"?this._onTouchStart(t):this._onMouseDown(t)))}function oi(t){this.enabled!==!1&&(t.pointerType==="touch"?this._onTouchMove(t):this._onMouseMove(t))}function ri(t){switch(this._removePointer(t),this._pointers.length){case 0:this.domElement.releasePointerCapture(t.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(qt),this.state=k.NONE;break;case 1:const e=this._pointers[0],n=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:n.x,pageY:n.y});break}}function ai(t){let e;switch(t.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Ae.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(t),this.state=k.DOLLY;break;case Ae.ROTATE:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=k.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=k.ROTATE}break;case Ae.PAN:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=k.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=k.PAN}break;default:this.state=k.NONE}this.state!==k.NONE&&this.dispatchEvent(gt)}function si(t){switch(this.state){case k.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(t);break;case k.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(t);break;case k.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(t);break}}function li(t){this.enabled===!1||this.enableZoom===!1||this.state!==k.NONE||(t.preventDefault(),this.dispatchEvent(gt),this._handleMouseWheel(this._customWheelEvent(t)),this.dispatchEvent(qt))}function ci(t){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(t)}function di(t){switch(this._trackPointer(t),this._pointers.length){case 1:switch(this.touches.ONE){case Oe.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(t),this.state=k.TOUCH_ROTATE;break;case Oe.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(t),this.state=k.TOUCH_PAN;break;default:this.state=k.NONE}break;case 2:switch(this.touches.TWO){case Oe.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(t),this.state=k.TOUCH_DOLLY_PAN;break;case Oe.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(t),this.state=k.TOUCH_DOLLY_ROTATE;break;default:this.state=k.NONE}break;default:this.state=k.NONE}this.state!==k.NONE&&this.dispatchEvent(gt)}function hi(t){switch(this._trackPointer(t),this.state){case k.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(t),this.update();break;case k.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(t),this.update();break;case k.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(t),this.update();break;case k.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(t),this.update();break;default:this.state=k.NONE}}function ui(t){this.enabled!==!1&&t.preventDefault()}function fi(t){t.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function pi(t){t.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const vi=()=>Xn("threlte-controls",{orbitControls:It(void 0),trackballControls:It(void 0)});function mi(t,e){dt(e,!0);const n=()=>wn(s,"$parent",i),[i,o]=Dn();let r=We(e,"ref",15),a=Mn(e,["$$slots","$$events","$$legacy","ref","children"]);const s=jn(),{dom:c,invalidate:l}=Gt();if(!Wt(n(),"Camera"))throw new Error("Parent missing: <OrbitControls> need to be a child of a <Camera>");const v=new ni(n(),c),{orbitControls:g}=vi();Ln(()=>{v.update()},{running:()=>e.autoRotate??e.enableDamping??!1}),fn(()=>{const _=P=>{l(),e.onchange?.(P)};return g.set(v),v.addEventListener("change",_),()=>{g.set(void 0),v.removeEventListener("change",_)}}),b(t,bn({get is(){return v}},()=>a,{get ref(){return r()},set ref(_){r(_)},children:(_,P)=>{var w=pn(),Z=ie(w);Zn(Z,()=>e.children??vn,()=>({ref:v})),W(_,w)},$$slots:{default:!0}})),ht(),o()}new Ie;new Ie;new Vt;`${me.logdepthbuf_pars_vertex}${me.fog_pars_vertex}${me.logdepthbuf_vertex}${me.fog_vertex}`;`${me.tonemapping_fragment}${me.colorspace_fragment}`;`${me.tonemapping_fragment}${me.colorspace_fragment}`;const _i=`

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
`,yi=`

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
`,gi=`
struct BVH {

	usampler2D index;
	sampler2D position;

	sampler2D bvhBounds;
	usampler2D bvhContents;

};
`,xi=gi,bi=`
	${_i}
	${yi}
`;`${xi}${bi}${me.tonemapping_fragment}${me.colorspace_fragment}`;new Ke;typeof window<"u"&&document.createElement("div");const wi=t=>{const{camera:e}=Gt();let n=t.current.clientWidth,i=t.current.clientHeight;const o=new ResizeObserver(([r])=>{n=r.contentRect.width,i=r.contentRect.height});return Kt(t,r=>(r&&o.observe(r),()=>{r&&o.unobserve(r)})),(r,a)=>{a.pointer.update(s=>(s.set(r.offsetX/n*2-1,-(r.offsetY/i)*2+1),s)),a.raycaster.setFromCamera(a.pointer.current,e.current)}},Qt=Symbol("interactivity-context"),Di=()=>Xt(Qt),Mi=t=>{const e=ve(Nn().dom),n={enabled:ve(!0),pointer:ve(new oe),pointerOverTarget:ve(!1),lastEvent:void 0,raycaster:new kn,initialClick:[0,0],initialHits:[],hovered:new Map,interactiveObjects:[],target:e,handlers:new WeakMap,compute:wi(e),filter:t?.filter,addInteractiveObject:(i,o)=>{n.interactiveObjects.indexOf(i)>-1||(n.handlers.set(i,o),n.interactiveObjects.push(i))},removeInteractiveObject:i=>{const o=n.interactiveObjects.indexOf(i);n.interactiveObjects.splice(o,1),n.handlers.delete(i)}};return Bt(Qt,n),n},Jt=()=>{const t=Di();if(!t)throw new Error("No interactivity context found. Did you forget to implement interactivity()?");return t},Ut=["onclick","oncontextmenu","ondblclick","onwheel","onpointerup","onpointerdown","onpointerover","onpointerout","onpointerenter","onpointerleave","onpointermove","onpointermissed"],Si=()=>{Bn("interactivity",t=>{if(!Wt(t.ref,"Object3D")||!Object.entries(t.props).some(([o,r])=>r!==void 0&&Ut.includes(o)))return;const{addInteractiveObject:n,removeInteractiveObject:i}=Jt();return zn.pre(()=>[t.ref],([o])=>(n(o,t.props),()=>{i(o)})),{pluginProps:Ut}})};function Ht(t){return`${(t.eventObject||t.object).uuid}|${t.index}|${t.instanceId}`}const Yt=[["click",!1],["contextmenu",!1],["dblclick",!1],["wheel",!1],["pointerdown",!0],["pointerup",!0],["pointerleave",!0],["pointerenter",!0],["pointermove",!0],["pointercancel",!0]],Pi=t=>{const{handlers:e}=Jt(),n=d=>{const f=d.offsetX-t.initialClick[0],h=d.offsetY-t.initialClick[1];return Math.round(Math.hypot(f,h))},i=d=>{if(t.hovered.size===0)return;const f=new Set;for(const h of d)f.add(Ht(h));for(const[h,u]of t.hovered)if(!f.has(h)){const{eventObject:C}=u;t.hovered.delete(h);const re=e.get(C);if(re){const I={...u,intersections:d};re.onpointerout?.(I),re.onpointerleave?.(I)}}},o=()=>{if(!t.enabled.current)return[];const d=[],f=t.raycaster.intersectObjects(t.interactiveObjects,!0),h=t.filter===void 0?f:t.filter(f,t);for(const u of h){let C=u.object;for(;C;)e.has(C)&&d.push({...u,eventObject:C}),C=C.parent}return d},r=(d,f)=>{for(const h of f)e.get(h)?.onpointermissed?.(d)},a=()=>{t.pointerOverTarget.set(!1),i([])},s=()=>{t.pointerOverTarget.set(!0)},c=d=>{const f=d.type,h=f==="pointermove",u=f==="click"||f==="contextmenu"||f==="dblclick";t.compute(d,t);const C=o(),re=u?n(d):0;f==="pointerdown"&&(t.initialClick=[d.offsetX,d.offsetY],t.initialHits=C.map(te=>te.eventObject)),u&&C.length===0&&re<=2&&r(d,t.interactiveObjects),h&&i(C);let I=!1;e:for(const te of C){const K=e.get(te.eventObject);if(!K)continue;const $={stopped:I,...te,intersections:C,stopPropagation(){if(I=!0,$.stopped=!0,t.hovered.size>0&&Array.from(t.hovered.values()).some(ne=>ne.eventObject===te.eventObject)){const ne=C.slice(0,C.indexOf(te));i([...ne,te])}},camera:t.raycaster.camera,delta:re,nativeEvent:d,pointer:t.pointer.current,ray:t.raycaster.ray};if(h){if(K.onpointerover||K.onpointerenter||K.onpointerout||K.onpointerleave){const ne=Ht($),_e=t.hovered.get(ne);_e?_e.stopped&&$.stopPropagation():(t.hovered.set(ne,$),K.onpointerover?.($),K.onpointerenter?.($))}K.onpointermove?.($)}else K[`on${f}`]?(!u||t.initialHits.includes(te.eventObject))&&(r(d,t.interactiveObjects.filter(ne=>!t.initialHits.includes(ne))),K[`on${f}`]?.($)):u&&t.initialHits.includes(te.eventObject)&&r(d,t.interactiveObjects.filter(ne=>!t.initialHits.includes(ne)));if(I)break e}};let l=0,v=null,g=-1/0,_=-1/0;const P=.25,w=d=>{Math.abs(d.offsetX-g)<P&&Math.abs(d.offsetY-_)<P||(g=d.offsetX,_=d.offsetY,v=d,l||(l=requestAnimationFrame(()=>{l=0,v&&(c(v),v=null)})))},Z=d=>{for(const[f]of Yt)f==="pointerleave"||f==="pointercancel"?d.removeEventListener(f,a):f==="pointermove"?d.removeEventListener(f,w):f==="pointerenter"?d.removeEventListener(f,s):d.removeEventListener(f,c)},X=d=>{for(const[f,h]of Yt)f==="pointerleave"||f==="pointercancel"?d.addEventListener(f,a,{passive:h}):f==="pointermove"?d.addEventListener(f,w,{passive:h}):f==="pointerenter"?d.addEventListener(f,s,{passive:h}):d.addEventListener(f,c,{passive:h})};Kt(t.target,d=>(d&&X(d),()=>{d&&Z(d)}))},Ei=t=>{const e=Mi(t);return Si(),Pi(e),e};for(let t=0;t<256;t++)(t<16?"0":"")+t.toString(16);new Rn(-1,1,1,-1,0,1);class Ci extends Un{constructor(){super(),this.setAttribute("position",new kt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new kt([0,2,0,0,2,0],2))}}new Ci;var en={exports:{}};en.exports=qe;en.exports.default=qe;function qe(t,e,n){n=n||2;var i=e&&e.length,o=i?e[0]*n:t.length,r=tn(t,0,o,n,!0),a=[];if(!r||r.next===r.prev)return a;var s,c,l,v,g,_,P;if(i&&(r=ji(t,e,r,n)),t.length>80*n){s=l=t[0],c=v=t[1];for(var w=n;w<o;w+=n)g=t[w],_=t[w+1],g<s&&(s=g),_<c&&(c=_),g>l&&(l=g),_>v&&(v=_);P=Math.max(l-s,v-c),P=P!==0?32767/P:0}return ke(r,a,n,s,c,P,0),a}function tn(t,e,n,i,o){var r,a;if(o===ct(t,e,n,i)>0)for(r=e;r<n;r+=i)a=Ft(r,t[r],t[r+1],a);else for(r=n-i;r>=e;r-=i)a=Ft(r,t[r],t[r+1],a);return a&&Qe(a,a.next)&&(Re(a),a=a.next),a}function Me(t,e){if(!t)return t;e||(e=t);var n=t,i;do if(i=!1,!n.steiner&&(Qe(n,n.next)||B(n.prev,n,n.next)===0)){if(Re(n),n=e=n.prev,n===n.next)break;i=!0}else n=n.next;while(i||n!==e);return e}function ke(t,e,n,i,o,r,a){if(t){!a&&r&&Ri(t,i,o,r);for(var s=t,c,l;t.prev!==t.next;){if(c=t.prev,l=t.next,r?Ti(t,i,o,r):Oi(t)){e.push(c.i/n|0),e.push(t.i/n|0),e.push(l.i/n|0),Re(t),t=l.next,s=l.next;continue}if(t=l,t===s){a?a===1?(t=Ai(Me(t),e,n),ke(t,e,n,i,o,r,2)):a===2&&Ii(t,e,n,i,o,r):ke(Me(t),e,n,i,o,r,1);break}}}}function Oi(t){var e=t.prev,n=t,i=t.next;if(B(e,n,i)>=0)return!1;for(var o=e.x,r=n.x,a=i.x,s=e.y,c=n.y,l=i.y,v=o<r?o<a?o:a:r<a?r:a,g=s<c?s<l?s:l:c<l?c:l,_=o>r?o>a?o:a:r>a?r:a,P=s>c?s>l?s:l:c>l?c:l,w=i.next;w!==e;){if(w.x>=v&&w.x<=_&&w.y>=g&&w.y<=P&&Te(o,s,r,c,a,l,w.x,w.y)&&B(w.prev,w,w.next)>=0)return!1;w=w.next}return!0}function Ti(t,e,n,i){var o=t.prev,r=t,a=t.next;if(B(o,r,a)>=0)return!1;for(var s=o.x,c=r.x,l=a.x,v=o.y,g=r.y,_=a.y,P=s<c?s<l?s:l:c<l?c:l,w=v<g?v<_?v:_:g<_?g:_,Z=s>c?s>l?s:l:c>l?c:l,X=v>g?v>_?v:_:g>_?g:_,d=st(P,w,e,n,i),f=st(Z,X,e,n,i),h=t.prevZ,u=t.nextZ;h&&h.z>=d&&u&&u.z<=f;){if(h.x>=P&&h.x<=Z&&h.y>=w&&h.y<=X&&h!==o&&h!==a&&Te(s,v,c,g,l,_,h.x,h.y)&&B(h.prev,h,h.next)>=0||(h=h.prevZ,u.x>=P&&u.x<=Z&&u.y>=w&&u.y<=X&&u!==o&&u!==a&&Te(s,v,c,g,l,_,u.x,u.y)&&B(u.prev,u,u.next)>=0))return!1;u=u.nextZ}for(;h&&h.z>=d;){if(h.x>=P&&h.x<=Z&&h.y>=w&&h.y<=X&&h!==o&&h!==a&&Te(s,v,c,g,l,_,h.x,h.y)&&B(h.prev,h,h.next)>=0)return!1;h=h.prevZ}for(;u&&u.z<=f;){if(u.x>=P&&u.x<=Z&&u.y>=w&&u.y<=X&&u!==o&&u!==a&&Te(s,v,c,g,l,_,u.x,u.y)&&B(u.prev,u,u.next)>=0)return!1;u=u.nextZ}return!0}function Ai(t,e,n){var i=t;do{var o=i.prev,r=i.next.next;!Qe(o,r)&&nn(o,i,i.next,r)&&ze(o,r)&&ze(r,o)&&(e.push(o.i/n|0),e.push(i.i/n|0),e.push(r.i/n|0),Re(i),Re(i.next),i=t=r),i=i.next}while(i!==t);return Me(i)}function Ii(t,e,n,i,o,r){var a=t;do{for(var s=a.next.next;s!==a.prev;){if(a.i!==s.i&&Yi(a,s)){var c=on(a,s);a=Me(a,a.next),c=Me(c,c.next),ke(a,e,n,i,o,r,0),ke(c,e,n,i,o,r,0);return}s=s.next}a=a.next}while(a!==t)}function ji(t,e,n,i){var o=[],r,a,s,c,l;for(r=0,a=e.length;r<a;r++)s=e[r]*i,c=r<a-1?e[r+1]*i:t.length,l=tn(t,s,c,i,!1),l===l.next&&(l.steiner=!0),o.push(Hi(l));for(o.sort(Li),r=0;r<o.length;r++)n=Ni(o[r],n);return n}function Li(t,e){return t.x-e.x}function Ni(t,e){var n=ki(t,e);if(!n)return e;var i=on(n,t);return Me(i,i.next),Me(n,n.next)}function ki(t,e){var n=e,i=t.x,o=t.y,r=-1/0,a;do{if(o<=n.y&&o>=n.next.y&&n.next.y!==n.y){var s=n.x+(o-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(s<=i&&s>r&&(r=s,a=n.x<n.next.x?n:n.next,s===i))return a}n=n.next}while(n!==e);if(!a)return null;var c=a,l=a.x,v=a.y,g=1/0,_;n=a;do i>=n.x&&n.x>=l&&i!==n.x&&Te(o<v?i:r,o,l,v,o<v?r:i,o,n.x,n.y)&&(_=Math.abs(o-n.y)/(i-n.x),ze(n,t)&&(_<g||_===g&&(n.x>a.x||n.x===a.x&&zi(a,n)))&&(a=n,g=_)),n=n.next;while(n!==c);return a}function zi(t,e){return B(t.prev,t,e.prev)<0&&B(e.next,t,t.next)<0}function Ri(t,e,n,i){var o=t;do o.z===0&&(o.z=st(o.x,o.y,e,n,i)),o.prevZ=o.prev,o.nextZ=o.next,o=o.next;while(o!==t);o.prevZ.nextZ=null,o.prevZ=null,Ui(o)}function Ui(t){var e,n,i,o,r,a,s,c,l=1;do{for(n=t,t=null,r=null,a=0;n;){for(a++,i=n,s=0,e=0;e<l&&(s++,i=i.nextZ,!!i);e++);for(c=l;s>0||c>0&&i;)s!==0&&(c===0||!i||n.z<=i.z)?(o=n,n=n.nextZ,s--):(o=i,i=i.nextZ,c--),r?r.nextZ=o:t=o,o.prevZ=r,r=o;n=i}r.nextZ=null,l*=2}while(a>1);return t}function st(t,e,n,i,o){return t=(t-n)*o|0,e=(e-i)*o|0,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t|e<<1}function Hi(t){var e=t,n=t;do(e.x<n.x||e.x===n.x&&e.y<n.y)&&(n=e),e=e.next;while(e!==t);return n}function Te(t,e,n,i,o,r,a,s){return(o-a)*(e-s)>=(t-a)*(r-s)&&(t-a)*(i-s)>=(n-a)*(e-s)&&(n-a)*(r-s)>=(o-a)*(i-s)}function Yi(t,e){return t.next.i!==e.i&&t.prev.i!==e.i&&!Fi(t,e)&&(ze(t,e)&&ze(e,t)&&Zi(t,e)&&(B(t.prev,t,e.prev)||B(t,e.prev,e))||Qe(t,e)&&B(t.prev,t,t.next)>0&&B(e.prev,e,e.next)>0)}function B(t,e,n){return(e.y-t.y)*(n.x-e.x)-(e.x-t.x)*(n.y-e.y)}function Qe(t,e){return t.x===e.x&&t.y===e.y}function nn(t,e,n,i){var o=Ge(B(t,e,n)),r=Ge(B(t,e,i)),a=Ge(B(n,i,t)),s=Ge(B(n,i,e));return!!(o!==r&&a!==s||o===0&&Xe(t,n,e)||r===0&&Xe(t,i,e)||a===0&&Xe(n,t,i)||s===0&&Xe(n,e,i))}function Xe(t,e,n){return e.x<=Math.max(t.x,n.x)&&e.x>=Math.min(t.x,n.x)&&e.y<=Math.max(t.y,n.y)&&e.y>=Math.min(t.y,n.y)}function Ge(t){return t>0?1:t<0?-1:0}function Fi(t,e){var n=t;do{if(n.i!==t.i&&n.next.i!==t.i&&n.i!==e.i&&n.next.i!==e.i&&nn(n,n.next,t,e))return!0;n=n.next}while(n!==t);return!1}function ze(t,e){return B(t.prev,t,t.next)<0?B(t,e,t.next)>=0&&B(t,t.prev,e)>=0:B(t,e,t.prev)<0||B(t,t.next,e)<0}function Zi(t,e){var n=t,i=!1,o=(t.x+e.x)/2,r=(t.y+e.y)/2;do n.y>r!=n.next.y>r&&n.next.y!==n.y&&o<(n.next.x-n.x)*(r-n.y)/(n.next.y-n.y)+n.x&&(i=!i),n=n.next;while(n!==t);return i}function on(t,e){var n=new lt(t.i,t.x,t.y),i=new lt(e.i,e.x,e.y),o=t.next,r=e.prev;return t.next=e,e.prev=t,n.next=o,o.prev=n,i.next=n,n.prev=i,r.next=i,i.prev=r,i}function Ft(t,e,n,i){var o=new lt(t,e,n);return i?(o.next=i.next,o.prev=i,i.next.prev=o,i.next=o):(o.prev=o,o.next=o),o}function Re(t){t.next.prev=t.prev,t.prev.next=t.next,t.prevZ&&(t.prevZ.nextZ=t.nextZ),t.nextZ&&(t.nextZ.prevZ=t.prevZ)}function lt(t,e,n){this.i=t,this.x=e,this.y=n,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}qe.deviation=function(t,e,n,i){var o=e&&e.length,r=o?e[0]*n:t.length,a=Math.abs(ct(t,0,r,n));if(o)for(var s=0,c=e.length;s<c;s++){var l=e[s]*n,v=s<c-1?e[s+1]*n:t.length;a-=Math.abs(ct(t,l,v,n))}var g=0;for(s=0;s<i.length;s+=3){var _=i[s]*n,P=i[s+1]*n,w=i[s+2]*n;g+=Math.abs((t[_]-t[w])*(t[P+1]-t[_+1])-(t[_]-t[P])*(t[w+1]-t[_+1]))}return a===0&&g===0?0:Math.abs((g-a)/a)};function ct(t,e,n,i){for(var o=0,r=e,a=n-i;r<n;r+=i)o+=(t[a]-t[r])*(t[r+1]+t[a+1]),a=r;return o}qe.flatten=function(t){for(var e=t[0][0].length,n={vertices:[],holes:[],dimensions:e},i=0,o=0;o<t.length;o++){for(var r=0;r<t[o].length;r++)for(var a=0;a<e;a++)n.vertices.push(t[o][r][a]);o>0&&(i+=t[o-1].length,n.holes.push(i))}return n};new oe;new oe;var Zt;(t=>{function e(o){let r=o.slice();return r.sort(t.POINT_COMPARATOR),t.makeHullPresorted(r)}t.makeHull=e;function n(o){if(o.length<=1)return o.slice();let r=[];for(let s=0;s<o.length;s++){const c=o[s];for(;r.length>=2;){const l=r[r.length-1],v=r[r.length-2];if((l.x-v.x)*(c.y-v.y)>=(l.y-v.y)*(c.x-v.x))r.pop();else break}r.push(c)}r.pop();let a=[];for(let s=o.length-1;s>=0;s--){const c=o[s];for(;a.length>=2;){const l=a[a.length-1],v=a[a.length-2];if((l.x-v.x)*(c.y-v.y)>=(l.y-v.y)*(c.x-v.x))a.pop();else break}a.push(c)}return a.pop(),r.length==1&&a.length==1&&r[0].x==a[0].x&&r[0].y==a[0].y?r:r.concat(a)}t.makeHullPresorted=n;function i(o,r){return o.x<r.x?-1:o.x>r.x?1:o.y<r.y?-1:o.y>r.y?1:0}t.POINT_COMPARATOR=i})(Zt||(Zt={}));new Hn;new A;new Ie;new ft;new ut;new Ke;new A;new A;var Bi=V("<!> <!>",1),Xi=V("<!> <!>",1),Gi=V("<!> <!>",1),Wi=V("<!> <!>",1),Vi=V("<!> <!>",1),Ki=V("<!> <!>",1),$i=V("<!> <!>",1),qi=V("<!> <!>",1),Qi=V("<!> <!>",1),Ji=V("<!> <!>",1),eo=V("<!> <!>",1),to=V("<!> <!>",1),no=V("<!> <!>",1),io=V("<!> <!>",1),oo=V("<!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!>",1),ro=V("<!> <!> <!> <!> <!> <!> <!>",1);function ao(t,e){dt(e,!0),Ei();let n=ge(!1),i=ge(!0);const o=20,r=20,a="#374151",s="#1f2937",c=.04,l=.3,v=.12,g=.2,_="#facc15",P=20;let w=!1,Z,X="x",d=0,f=0,h=!1;function u(U,R,G){G.stopPropagation(),U&&(w=!0,Z=U,X=R,h=!1,f=0,d=R==="x"?G.event?.clientX??0:G.event?.clientY??0,J(i,!1),document.addEventListener("pointermove",C),document.addEventListener("pointerup",re,{once:!0}))}function C(U){if(!w)return;const R=X==="x"?U.clientX:U.clientY,G=R-d;d=R;const le=X==="y"?-G:G;for(f+=le;f>=P;)Z?.(1),f-=P,h=!0;for(;f<=-P;)Z?.(-1),f+=P,h=!0}function re(){w=!1,Z=void 0,J(i,!0),document.removeEventListener("pointermove",C)}function I(U,R,G){if(h){h=!1;return}U.stopPropagation(),R?.(G)}mn(()=>()=>{document.removeEventListener("pointermove",C)});var te=ro(),K=ie(te);D(K,()=>b.PerspectiveCamera,(U,R)=>{R(U,{makeDefault:!0,position:[8,6,8],fov:45,children:(G,le)=>{mi(G,{enableDamping:!0,dampingFactor:.05,get enabled(){return y(i)}})},$$slots:{default:!0}})});var $=m(K,2);D($,()=>b.AmbientLight,(U,R)=>{R(U,{intensity:.5})});var ne=m($,2);D(ne,()=>b.DirectionalLight,(U,R)=>{R(U,{position:[5,10,5],intensity:1.2,castShadow:!0})});var _e=m(ne,2);D(_e,()=>b.GridHelper,(U,R)=>{R(U,{args:[o,r,a,s],position:[0,0,0]})});var Se=m(_e,2);{let U=ee(()=>[0,e.dimY/2,0]);D(Se,()=>b.Mesh,(R,G)=>{G(R,{get position(){return y(U)},castShadow:!0,receiveShadow:!0,onclick:le=>{le.stopPropagation(),J(n,!y(n))},children:(le,xe)=>{var de=Bi(),he=ie(de);{let ae=ee(()=>[e.dimX,e.dimY,e.dimZ]);D(he,()=>b.BoxGeometry,(ce,ue)=>{ue(ce,{get args(){return y(ae)}})})}var ye=m(he,2);{let ae=ee(()=>y(n)?"#86efac":"#4ade80");D(ye,()=>b.MeshStandardMaterial,(ce,ue)=>{ue(ce,{get color(){return y(ae)},metalness:.3,roughness:.5})})}W(le,de)},$$slots:{default:!0}})})}var Pe=m(Se,2);{let U=ee(()=>[0,e.dimY/2,0]);D(Pe,()=>b.Mesh,(R,G)=>{G(R,{get position(){return y(U)},children:(le,xe)=>{var de=Xi(),he=ie(de);{let ae=ee(()=>[e.dimX,e.dimY,e.dimZ]);D(he,()=>b.BoxGeometry,(ce,ue)=>{ue(ce,{get args(){return y(ae)}})})}var ye=m(he,2);D(ye,()=>b.MeshBasicMaterial,(ae,ce)=>{ce(ae,{color:"#166534",wireframe:!0})}),W(le,de)},$$slots:{default:!0}})})}var Ye=m(Pe,2);{var Je=U=>{var R=oo(),G=ie(R);{let N=ee(()=>[e.dimX/2+l/2,e.dimY/2,0]);D(G,()=>b.Mesh,(H,T)=>{T(H,{get position(){return y(N)},rotation:[0,0,-Math.PI/2],onclick:p=>I(p,e.onAdjustX,1),onpointerdown:p=>u(e.onAdjustX,"x",p),children:(p,q)=>{var E=Gi(),O=ie(E);D(O,()=>b.CylinderGeometry,(x,M)=>{M(x,{args:[c,c,l,8]})});var L=m(O,2);D(L,()=>b.MeshStandardMaterial,(x,M)=>{M(x,{color:_})}),W(p,E)},$$slots:{default:!0}})})}var le=m(G,2);{let N=ee(()=>[e.dimX/2+l+g/2,e.dimY/2,0]);D(le,()=>b.Mesh,(H,T)=>{T(H,{get position(){return y(N)},rotation:[0,0,-Math.PI/2],onclick:p=>I(p,e.onAdjustX,1),onpointerdown:p=>u(e.onAdjustX,"x",p),children:(p,q)=>{var E=Wi(),O=ie(E);D(O,()=>b.ConeGeometry,(x,M)=>{M(x,{args:[v,g,8]})});var L=m(O,2);D(L,()=>b.MeshStandardMaterial,(x,M)=>{M(x,{color:_})}),W(p,E)},$$slots:{default:!0}})})}var xe=m(le,2);{let N=ee(()=>[-e.dimX/2-l/2,e.dimY/2,0]);D(xe,()=>b.Mesh,(H,T)=>{T(H,{get position(){return y(N)},rotation:[0,0,Math.PI/2],onclick:p=>I(p,e.onAdjustX,-1),onpointerdown:p=>u(e.onAdjustX,"x",p),children:(p,q)=>{var E=Vi(),O=ie(E);D(O,()=>b.CylinderGeometry,(x,M)=>{M(x,{args:[c,c,l,8]})});var L=m(O,2);D(L,()=>b.MeshStandardMaterial,(x,M)=>{M(x,{color:_})}),W(p,E)},$$slots:{default:!0}})})}var de=m(xe,2);{let N=ee(()=>[-e.dimX/2-l-g/2,e.dimY/2,0]);D(de,()=>b.Mesh,(H,T)=>{T(H,{get position(){return y(N)},rotation:[0,0,Math.PI/2],onclick:p=>I(p,e.onAdjustX,-1),onpointerdown:p=>u(e.onAdjustX,"x",p),children:(p,q)=>{var E=Ki(),O=ie(E);D(O,()=>b.ConeGeometry,(x,M)=>{M(x,{args:[v,g,8]})});var L=m(O,2);D(L,()=>b.MeshStandardMaterial,(x,M)=>{M(x,{color:_})}),W(p,E)},$$slots:{default:!0}})})}var he=m(de,2);{let N=ee(()=>[0,e.dimY+l/2,0]);D(he,()=>b.Mesh,(H,T)=>{T(H,{get position(){return y(N)},onclick:p=>I(p,e.onAdjustY,1),onpointerdown:p=>u(e.onAdjustY,"y",p),children:(p,q)=>{var E=$i(),O=ie(E);D(O,()=>b.CylinderGeometry,(x,M)=>{M(x,{args:[c,c,l,8]})});var L=m(O,2);D(L,()=>b.MeshStandardMaterial,(x,M)=>{M(x,{color:_})}),W(p,E)},$$slots:{default:!0}})})}var ye=m(he,2);{let N=ee(()=>[0,e.dimY+l+g/2,0]);D(ye,()=>b.Mesh,(H,T)=>{T(H,{get position(){return y(N)},onclick:p=>I(p,e.onAdjustY,1),onpointerdown:p=>u(e.onAdjustY,"y",p),children:(p,q)=>{var E=qi(),O=ie(E);D(O,()=>b.ConeGeometry,(x,M)=>{M(x,{args:[v,g,8]})});var L=m(O,2);D(L,()=>b.MeshStandardMaterial,(x,M)=>{M(x,{color:_})}),W(p,E)},$$slots:{default:!0}})})}var ae=m(ye,2);D(ae,()=>b.Mesh,(N,H)=>{H(N,{position:[0,-l/2,0],rotation:[0,0,Math.PI],onclick:T=>I(T,e.onAdjustY,-1),onpointerdown:T=>u(e.onAdjustY,"y",T),children:(T,p)=>{var q=Qi(),E=ie(q);D(E,()=>b.CylinderGeometry,(L,x)=>{x(L,{args:[c,c,l,8]})});var O=m(E,2);D(O,()=>b.MeshStandardMaterial,(L,x)=>{x(L,{color:_})}),W(T,q)},$$slots:{default:!0}})});var ce=m(ae,2);D(ce,()=>b.Mesh,(N,H)=>{H(N,{position:[0,-l-g/2,0],rotation:[0,0,Math.PI],onclick:T=>I(T,e.onAdjustY,-1),onpointerdown:T=>u(e.onAdjustY,"y",T),children:(T,p)=>{var q=Ji(),E=ie(q);D(E,()=>b.ConeGeometry,(L,x)=>{x(L,{args:[v,g,8]})});var O=m(E,2);D(O,()=>b.MeshStandardMaterial,(L,x)=>{x(L,{color:_})}),W(T,q)},$$slots:{default:!0}})});var ue=m(ce,2);{let N=ee(()=>[0,e.dimY/2,e.dimZ/2+l/2]);D(ue,()=>b.Mesh,(H,T)=>{T(H,{get position(){return y(N)},rotation:[Math.PI/2,0,0],onclick:p=>I(p,e.onAdjustZ,1),onpointerdown:p=>u(e.onAdjustZ,"x",p),children:(p,q)=>{var E=eo(),O=ie(E);D(O,()=>b.CylinderGeometry,(x,M)=>{M(x,{args:[c,c,l,8]})});var L=m(O,2);D(L,()=>b.MeshStandardMaterial,(x,M)=>{M(x,{color:_})}),W(p,E)},$$slots:{default:!0}})})}var je=m(ue,2);{let N=ee(()=>[0,e.dimY/2,e.dimZ/2+l+g/2]);D(je,()=>b.Mesh,(H,T)=>{T(H,{get position(){return y(N)},rotation:[Math.PI/2,0,0],onclick:p=>I(p,e.onAdjustZ,1),onpointerdown:p=>u(e.onAdjustZ,"x",p),children:(p,q)=>{var E=to(),O=ie(E);D(O,()=>b.ConeGeometry,(x,M)=>{M(x,{args:[v,g,8]})});var L=m(O,2);D(L,()=>b.MeshStandardMaterial,(x,M)=>{M(x,{color:_})}),W(p,E)},$$slots:{default:!0}})})}var Le=m(je,2);{let N=ee(()=>[0,e.dimY/2,-e.dimZ/2-l/2]);D(Le,()=>b.Mesh,(H,T)=>{T(H,{get position(){return y(N)},rotation:[-Math.PI/2,0,0],onclick:p=>I(p,e.onAdjustZ,-1),onpointerdown:p=>u(e.onAdjustZ,"x",p),children:(p,q)=>{var E=no(),O=ie(E);D(O,()=>b.CylinderGeometry,(x,M)=>{M(x,{args:[c,c,l,8]})});var L=m(O,2);D(L,()=>b.MeshStandardMaterial,(x,M)=>{M(x,{color:_})}),W(p,E)},$$slots:{default:!0}})})}var Fe=m(Le,2);{let N=ee(()=>[0,e.dimY/2,-e.dimZ/2-l-g/2]);D(Fe,()=>b.Mesh,(H,T)=>{T(H,{get position(){return y(N)},rotation:[-Math.PI/2,0,0],onclick:p=>I(p,e.onAdjustZ,-1),onpointerdown:p=>u(e.onAdjustZ,"x",p),children:(p,q)=>{var E=io(),O=ie(E);D(O,()=>b.ConeGeometry,(x,M)=>{M(x,{args:[v,g,8]})});var L=m(O,2);D(L,()=>b.MeshStandardMaterial,(x,M)=>{M(x,{color:_})}),W(p,E)},$$slots:{default:!0}})})}W(U,R)};at(Ye,U=>{y(n)&&U(Je)})}W(t,te),ht()}class so{parse(e,n={}){n=Object.assign({binary:!1},n);const i=n.binary,o=[];let r=0;e.traverse(function(d){if(d.isMesh){const f=d.geometry,h=f.index,u=f.getAttribute("position");r+=h!==null?h.count/3:u.count/3,o.push({object3d:d,geometry:f})}});let a,s=80;if(i===!0){const d=r*2+r*3*4*4+80+4,f=new ArrayBuffer(d);a=new DataView(f),a.setUint32(s,r,!0),s+=4}else a="",a+=`solid exported
`;const c=new A,l=new A,v=new A,g=new A,_=new A,P=new A;for(let d=0,f=o.length;d<f;d++){const h=o[d].object3d,u=o[d].geometry,C=u.index,re=u.getAttribute("position");if(C!==null)for(let I=0;I<C.count;I+=3){const te=C.getX(I+0),K=C.getX(I+1),$=C.getX(I+2);w(te,K,$,re,h)}else for(let I=0;I<re.count;I+=3){const te=I+0,K=I+1,$=I+2;w(te,K,$,re,h)}}return i===!1&&(a+=`endsolid exported
`),a;function w(d,f,h,u,C){c.fromBufferAttribute(u,d),l.fromBufferAttribute(u,f),v.fromBufferAttribute(u,h),C.isSkinnedMesh===!0&&(C.applyBoneTransform(d,c),C.applyBoneTransform(f,l),C.applyBoneTransform(h,v)),c.applyMatrix4(C.matrixWorld),l.applyMatrix4(C.matrixWorld),v.applyMatrix4(C.matrixWorld),Z(c,l,v),X(c),X(l),X(v),i===!0?(a.setUint16(s,0,!0),s+=2):(a+=`		endloop
`,a+=`	endfacet
`)}function Z(d,f,h){g.subVectors(h,f),_.subVectors(d,f),g.cross(_).normalize(),P.copy(g).normalize(),i===!0?(a.setFloat32(s,P.x,!0),s+=4,a.setFloat32(s,P.y,!0),s+=4,a.setFloat32(s,P.z,!0),s+=4):(a+="	facet normal "+P.x+" "+P.y+" "+P.z+`
`,a+=`		outer loop
`)}function X(d){i===!0?(a.setFloat32(s,d.x,!0),s+=4,a.setFloat32(s,d.y,!0),s+=4,a.setFloat32(s,d.z,!0),s+=4):a+="			vertex "+d.x+" "+d.y+" "+d.z+`
`}}}var lo=V("<button> </button>"),co=V('<button class="ml-3 underline opacity-70 hover:opacity-100">Dismiss</button>'),ho=V("<div> <!></div>"),uo=V('<div class="flex flex-col gap-6 w-full"><div class="flex flex-wrap items-center gap-6"><div class="flex items-center gap-3"><span class="text-sm font-medium text-gray-400">Units:</span> <div class="flex rounded-lg overflow-hidden border border-gray-600"><button>mm</button> <button>in</button></div></div> <div class="flex items-center gap-3"><span class="text-sm font-medium text-gray-400">Step (mm):</span> <div class="flex rounded-lg overflow-hidden border border-gray-600"></div></div> <div class="flex items-center gap-3 ml-auto"><button class="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors" title="Export 3D model as STL file"><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg> Download STL</button> <button class="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors" title="Upload STL, metadata and preview to Nextcloud"><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd"></path></svg> </button></div></div> <!> <div class="flex flex-wrap gap-4 text-xs font-mono text-gray-500"><span></span> <span>|</span> <span></span></div> <div class="relative w-full rounded-xl overflow-hidden border border-gray-700" style="height: 480px;"><!> <div class="absolute bottom-4 left-4 z-10 bg-gray-900/80 backdrop-blur-sm rounded-xl p-3 border border-gray-700 select-none"><p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Adjust</p> <div class="flex flex-col gap-2"><div class="flex items-center gap-2"><span class="w-20 text-xs text-gray-300">Width (X)</span> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Decrease width">←</button> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Increase width">→</button></div> <div class="flex items-center gap-2"><span class="w-20 text-xs text-gray-300">Height (Y)</span> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Decrease height">↓</button> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Increase height">↑</button></div> <div class="flex items-center gap-2"><span class="w-20 text-xs text-gray-300">Length (Z)</span> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Decrease length">←</button> <button class="w-7 h-7 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 text-white transition-colors" aria-label="Increase length">→</button></div></div></div> <div class="absolute bottom-4 right-4 z-10 bg-gray-900/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-700"><p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Dimensions</p> <div class="flex flex-col gap-1 font-mono text-sm"><div class="flex gap-3"><span class="text-gray-500 w-4">W</span> <span class="text-green-400"> </span></div> <div class="flex gap-3"><span class="text-gray-500 w-4">L</span> <span class="text-green-400"> </span></div> <div class="flex gap-3"><span class="text-gray-500 w-4">H</span> <span class="text-green-400"> </span></div></div></div></div></div>');function Mo(t,e){dt(e,!0);let n=We(e,"nextcloudServer",3,""),i=We(e,"cncUser",3,""),o=We(e,"cncPassword",3,"");const r=1/25,a=1/25.4,s=[.1,1,2.5,5,10],c=100,l=950,v=100,g=1200,_=10,P=150;let w=ge(310),Z=ge(405),X=ge(120),d=ge("mm"),f=ge(1),h=ge("idle"),u=ge("");const C={idle:"",uploading:"bg-blue-900/40 border-blue-700 text-blue-300",success:"bg-green-900/40 border-green-700 text-green-300",error:"bg-red-900/40 border-red-700 text-red-300"};let re=ee(()=>C[y(h)]),I=ee(()=>y(w)*r),te=ee(()=>y(X)*r),K=ee(()=>y(Z)*r);function $(S){return y(d)==="in"?(S*a).toFixed(3):S.toFixed(1)}function ne(S,z,j){return Math.max(z,Math.min(j,S))}function _e(S){J(w,ne(y(w)+y(f)*S,c,l),!0)}function Se(S){J(X,ne(y(X)+y(f)*S,_,P),!0)}function Pe(S){J(Z,ne(y(Z)+y(f)*S,v,g),!0)}function Ye(){const S=new Fn(y(w),y(X),y(Z)),z=new Vt(S);return new so().parse(z,{binary:!0})}function Je(){const S=Ye(),z=new Blob([S.buffer],{type:"application/octet-stream"}),j=URL.createObjectURL(z),fe=document.createElement("a");fe.href=j,fe.download="model.stl",document.body.appendChild(fe),fe.click(),document.body.removeChild(fe),URL.revokeObjectURL(j)}function U(){return new Promise(S=>{const z=document.querySelector("canvas");if(!z){S(null);return}z.toBlob(j=>S(j),"image/png")})}async function R(S,z){const j=await fetch(S,{method:"MKCOL",headers:{Authorization:z}});if(!j.ok&&j.status!==405)throw new Error(`MKCOL ${S} → ${j.status} ${j.statusText}`)}async function G(S,z,j,fe){const be=await fetch(S,{method:"PUT",headers:{Authorization:j,"Content-Type":fe},body:z});if(!be.ok)throw new Error(`PUT ${S} → ${be.status} ${be.statusText}`)}async function le(){if(!n()||!i()||!o()){J(h,"error"),J(u,"Nextcloud credentials are not configured (NEXTCLOUD_WEBDAV_SERVER, CNC_APP_USER, CNC_APP_PASSWORD).");return}J(h,"uploading"),J(u,"Uploading to Nextcloud…");try{let S=localStorage.getItem("oakpine_user_id");S||(S="USER_"+Date.now(),localStorage.setItem("oakpine_user_id",S));const z="Project_"+crypto.randomUUID(),j="Basic "+btoa(`${i()}:${o()}`),be=`${n().replace(/\/$/,"")+"/remote.php/dav/files/"+i()}/CNC-Projects`,Ee=`${be}/${S}`,we=`${Ee}/${z}`;await R(be,j),await R(Ee,j),await R(we,j);const hn=Ye();await G(`${we}/model.stl`,hn.buffer,j,"application/octet-stream");const un={created_at:new Date().toISOString(),dimensions:{width_mm:y(w),length_mm:y(Z),height_mm:y(X)},limits:{min:{width_mm:c,length_mm:v,height_mm:_},max:{width_mm:l,length_mm:g,height_mm:P}},unit:y(d)};await G(`${we}/metadata.json`,JSON.stringify(un,null,2),j,"application/json");const At=await U();At&&await G(`${we}/preview.png`,At,j,"image/png"),J(h,"success"),J(u,`Uploaded to /CNC-Projects/${S}/${z}`)}catch(S){J(h,"error"),J(u,S instanceof Error?S.message:"Upload failed",!0)}}var xe=uo(),de=F(xe),he=F(de),ye=m(F(he),2),ae=F(ye),ce=m(ae,2);Y(ye),Y(he);var ue=m(he,2),je=m(F(ue),2);yn(je,21,()=>s,gn,(S,z)=>{var j=lo(),fe=F(j,!0);Y(j),ot(()=>{Ze(j,1,`px-3 py-1.5 text-sm font-semibold transition-colors ${y(f)===y(z)?"bg-green-500 text-white":"bg-gray-800 text-gray-400 hover:text-white"}`),Ce(fe,y(z))}),pe("click",j,()=>J(f,y(z),!0)),W(S,j)}),Y(je),Y(ue);var Le=m(ue,2),Fe=F(Le),N=m(Fe,2),H=m(F(N));Y(N),Y(Le),Y(de);var T=m(de,2);{var p=S=>{var z=ho(),j=F(z),fe=m(j);{var be=Ee=>{var we=co();pe("click",we,()=>{J(h,"idle"),J(u,"")}),W(Ee,we)};at(fe,Ee=>{y(h)!=="uploading"&&Ee(be)})}Y(z),ot(()=>{Ze(z,1,`rounded-lg px-4 py-3 text-sm font-medium border ${y(re)??""}`),Ce(j,`${y(u)??""} `)}),W(S,z)};at(T,S=>{y(h)!=="idle"&&S(p)})}var q=m(T,2),E=F(q);E.textContent="Min: 100 × 100 × 10 mm  (W × L × H)";var O=m(E,4);O.textContent="Max: 950 × 1200 × 150 mm  (W × L × H)",Y(q);var L=m(q,2),x=F(L);Yn(x,{children:(S,z)=>{ao(S,{get dimX(){return y(I)},get dimY(){return y(te)},get dimZ(){return y(K)},onAdjustX:_e,onAdjustY:Se,onAdjustZ:Pe})},$$slots:{default:!0}});var M=m(x,2),xt=m(F(M),2),et=F(xt),bt=m(F(et),2),rn=m(bt,2);Y(et);var tt=m(et,2),wt=m(F(tt),2),an=m(wt,2);Y(tt);var Dt=m(tt,2),Mt=m(F(Dt),2),sn=m(Mt,2);Y(Dt),Y(xt),Y(M);var St=m(M,2),Pt=m(F(St),2),nt=F(Pt),Et=m(F(nt),2),ln=F(Et);Y(Et),Y(nt);var it=m(nt,2),Ct=m(F(it),2),cn=F(Ct);Y(Ct),Y(it);var Ot=m(it,2),Tt=m(F(Ot),2),dn=F(Tt);Y(Tt),Y(Ot),Y(Pt),Y(St),Y(L),Y(xe),ot((S,z,j)=>{Ze(ae,1,`px-4 py-1.5 text-sm font-semibold transition-colors ${y(d)==="mm"?"bg-green-500 text-white":"bg-gray-800 text-gray-400 hover:text-white"}`),Ze(ce,1,`px-4 py-1.5 text-sm font-semibold transition-colors ${y(d)==="in"?"bg-green-500 text-white":"bg-gray-800 text-gray-400 hover:text-white"}`),N.disabled=y(h)==="uploading",Ce(H,` ${y(h)==="uploading"?"Uploading…":"Manufacture"}`),Ce(ln,`${S??""} ${y(d)??""}`),Ce(cn,`${z??""} ${y(d)??""}`),Ce(dn,`${j??""} ${y(d)??""}`)},[()=>$(y(w)),()=>$(y(Z)),()=>$(y(X))]),pe("click",ae,()=>J(d,"mm")),pe("click",ce,()=>J(d,"in")),pe("click",Fe,Je),pe("click",N,le),pe("click",bt,()=>_e(-1)),pe("click",rn,()=>_e(1)),pe("click",wt,()=>Se(-1)),pe("click",an,()=>Se(1)),pe("click",Mt,()=>Pe(-1)),pe("click",sn,()=>Pe(1)),W(t,xe),ht()}_n(["click"]);export{Mo as default};
