import"./disclose-version.DsnmJJEf.js";import{o as Vt,q as $t,p as ft,u as mn,h as _n,i as re,v as gn,a as $,b as pt,w as yn,d as g,g as m,e as we,f as K,s as ee,x as te,t as st,c as z,r as L}from"./template.C4tWkZGb.js";import{d as xn,a as pe,s as be}from"./render.D1p6ZZTq.js";import{i as ct}from"./if.BFCGVVN2.js";import{e as bn,i as wn}from"./each.BQPasJCA.js";import{s as Xe}from"./class.CycsNbJG.js";import{p as kt,u as Dn,c as me,D as Ue,V as I,S as vt,M as Ne,R as mt,O as Mn,a as se,B as Ke,U as $e,b as Sn,d as Pn,e as He,L as En,C as Cn,f as je,T as Ie,Q as zt,g as Rt,P as On,h as Tn,i as In,j as Kt,k as qt,l as An,m as D,n as Qt,o as ge,w as Jt,q as jn,r as Nn,s as Ln,t as kn,v as zn,F as Ut,x as Rn,y as M,z as Un,A as Hn}from"./T.MaVQFx4G.js";import{s as Yn}from"./snippet.B29E2ke9.js";import{d as Fn,w as Ht,p as Zn,s as Bn,a as Xn,b as Gn,r as Wn}from"./props.Dv6ScJEH.js";import"./branches.LbBkNxWr.js";function Vn(t,e){e&&Vt(kt,{...$t(kt),[t]:e})}function $n(t,e,n){const i=Dn();if(!i)throw new Error("No user context store found, did you invoke this function outside of your main <Canvas> component?");return e?(i.update(o=>{if(t in o)return o;const r=typeof e=="function"?e():e;return o[t]=r,o}),i.current[t]):Fn(i,o=>o[t])}const Me=t=>({subscribe:t.subscribe,get current(){return t.current}});let Le=0;const _t=me(!1),qe=me(!1),gt=me(void 0),yt=me(0),xt=me(0),en=me([]),bt=me(0),{onStart:Kn,onLoad:qn,onError:Qn}=Ue;Ue.onStart=(t,e,n)=>{Kn?.(t,e,n),qe.set(!0),gt.set(t),yt.set(e),xt.set(n);const i=(e-Le)/(n-Le);bt.set(i),i===1&&_t.set(!0)};Ue.onLoad=()=>{qn?.(),qe.set(!1)};Ue.onError=t=>{Qn?.(t),en.update(e=>[...e,t])};Ue.onProgress=(t,e,n)=>{e===n&&(Le=n),qe.set(!0),gt.set(t),yt.set(e),xt.set(n);const i=(e-Le)/(n-Le)||1;bt.set(i),i===1&&_t.set(!0)};Me(qe),Me(gt),Me(yt),Me(xt),Me(en),Me(bt),Me(_t);new I;new I;new I;new vt;new Ne;new mt;new I;new I;new Ne;new I;new I;new Mn;new I;new I;new I;new se;const Jn="Right",ei="Top",ti="Front",ni="Left",ii="Bottom",oi="Back";[Jn,ei,ti,ni,ii,oi].map(t=>t.toLocaleLowerCase());new Ke;new I;$e.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new se(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};Sn.line={uniforms:Pn.merge([$e.common,$e.fog,$e.line]),vertexShader:`
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
		`};new He;new I;new I;new He;new He;new He;new I;new Ne;new En;new I;new Ke;new vt;new He;const Yt={type:"change"},wt={type:"start"},tn={type:"end"},Ge=new mt,Ft=new On,ri=Math.cos(70*Tn.DEG2RAD),J=new I,ce=2*Math.PI,k={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},lt=1e-6;let ai=class extends Cn{constructor(e,n=null){super(e,n),this.state=k.NONE,this.enabled=!0,this.target=new I,this.cursor=new I,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:je.ROTATE,MIDDLE:je.DOLLY,RIGHT:je.PAN},this.touches={ONE:Ie.ROTATE,TWO:Ie.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new I,this._lastQuaternion=new zt,this._lastTargetPosition=new I,this._quat=new zt().setFromUnitVectors(e.up,new I(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Rt,this._sphericalDelta=new Rt,this._scale=1,this._panOffset=new I,this._rotateStart=new se,this._rotateEnd=new se,this._rotateDelta=new se,this._panStart=new se,this._panEnd=new se,this._panDelta=new se,this._dollyStart=new se,this._dollyEnd=new se,this._dollyDelta=new se,this._dollyDirection=new I,this._mouse=new se,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=li.bind(this),this._onPointerDown=si.bind(this),this._onPointerUp=ci.bind(this),this._onContextMenu=mi.bind(this),this._onMouseWheel=ui.bind(this),this._onKeyDown=fi.bind(this),this._onTouchStart=pi.bind(this),this._onTouchMove=vi.bind(this),this._onMouseDown=di.bind(this),this._onMouseMove=hi.bind(this),this._interceptControlDown=_i.bind(this),this._interceptControlUp=gi.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Yt),this.update(),this.state=k.NONE}update(e=null){const n=this.object.position;J.copy(n).sub(this.target),J.applyQuaternion(this._quat),this._spherical.setFromVector3(J),this.autoRotate&&this.state===k.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,o=this.maxAzimuthAngle;isFinite(i)&&isFinite(o)&&(i<-Math.PI?i+=ce:i>Math.PI&&(i-=ce),o<-Math.PI?o+=ce:o>Math.PI&&(o-=ce),i<=o?this._spherical.theta=Math.max(i,Math.min(o,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+o)/2?Math.max(i,this._spherical.theta):Math.min(o,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(J.setFromSpherical(this._spherical),J.applyQuaternion(this._quatInverse),n.copy(this.target).add(J),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const s=J.length();a=this._clampDistance(s*this._scale);const c=s-a;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){const s=new I(this._mouse.x,this._mouse.y,0);s.unproject(this.object);const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;const l=new I(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(s),this.object.updateMatrixWorld(),a=J.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Ge.origin.copy(this.object.position),Ge.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Ge.direction))<ri?this.object.lookAt(this.target):(Ft.setFromNormalAndCoplanarPoint(this.object.up,this.target),Ge.intersectPlane(Ft,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>lt||8*(1-this._lastQuaternion.dot(this.object.quaternion))>lt||this._lastTargetPosition.distanceToSquared(this.target)>lt?(this.dispatchEvent(Yt),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?ce/60*this.autoRotateSpeed*e:ce/60/60*this.autoRotateSpeed}_getZoomScale(e){const n=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*n)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,n){J.setFromMatrixColumn(n,0),J.multiplyScalar(-e),this._panOffset.add(J)}_panUp(e,n){this.screenSpacePanning===!0?J.setFromMatrixColumn(n,1):(J.setFromMatrixColumn(n,0),J.crossVectors(this.object.up,J)),J.multiplyScalar(e),this._panOffset.add(J)}_pan(e,n){const i=this.domElement;if(this.object.isPerspectiveCamera){const o=this.object.position;J.copy(o).sub(this.target);let r=J.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/i.clientHeight,this.object.matrix),this._panUp(2*n*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(n*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,n){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),o=e-i.left,r=n-i.top,a=i.width,s=i.height;this._mouse.x=o/a*2-1,this._mouse.y=-(r/s)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(ce*this._rotateDelta.x/n.clientHeight),this._rotateUp(ce*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let n=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(ce*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),n=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(-ce*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),n=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(ce*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),n=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(-ce*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),n=!0;break}n&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),o=.5*(e.pageY+n.y);this._rotateStart.set(i,o)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),o=.5*(e.pageY+n.y);this._panStart.set(i,o)}}_handleTouchStartDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,o=e.pageY-n.y,r=Math.sqrt(i*i+o*o);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),o=.5*(e.pageX+i.x),r=.5*(e.pageY+i.y);this._rotateEnd.set(o,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(ce*this._rotateDelta.x/n.clientHeight),this._rotateUp(ce*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),o=.5*(e.pageY+n.y);this._panEnd.set(i,o)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,o=e.pageY-n.y,r=Math.sqrt(i*i+o*o);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+n.x)*.5,s=(e.pageY+n.y)*.5;this._updateZoomParameters(a,s)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId){this._pointers.splice(n,1);return}}_isTrackingPointer(e){for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId)return!0;return!1}_trackPointer(e){let n=this._pointerPositions[e.pointerId];n===void 0&&(n=new se,this._pointerPositions[e.pointerId]=n),n.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const n=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[n]}_customWheelEvent(e){const n=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(n){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}};function si(t){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(t.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(t)&&(this._addPointer(t),t.pointerType==="touch"?this._onTouchStart(t):this._onMouseDown(t)))}function li(t){this.enabled!==!1&&(t.pointerType==="touch"?this._onTouchMove(t):this._onMouseMove(t))}function ci(t){switch(this._removePointer(t),this._pointers.length){case 0:this.domElement.releasePointerCapture(t.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(tn),this.state=k.NONE;break;case 1:const e=this._pointers[0],n=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:n.x,pageY:n.y});break}}function di(t){let e;switch(t.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case je.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(t),this.state=k.DOLLY;break;case je.ROTATE:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=k.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=k.ROTATE}break;case je.PAN:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=k.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=k.PAN}break;default:this.state=k.NONE}this.state!==k.NONE&&this.dispatchEvent(wt)}function hi(t){switch(this.state){case k.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(t);break;case k.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(t);break;case k.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(t);break}}function ui(t){this.enabled===!1||this.enableZoom===!1||this.state!==k.NONE||(t.preventDefault(),this.dispatchEvent(wt),this._handleMouseWheel(this._customWheelEvent(t)),this.dispatchEvent(tn))}function fi(t){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(t)}function pi(t){switch(this._trackPointer(t),this._pointers.length){case 1:switch(this.touches.ONE){case Ie.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(t),this.state=k.TOUCH_ROTATE;break;case Ie.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(t),this.state=k.TOUCH_PAN;break;default:this.state=k.NONE}break;case 2:switch(this.touches.TWO){case Ie.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(t),this.state=k.TOUCH_DOLLY_PAN;break;case Ie.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(t),this.state=k.TOUCH_DOLLY_ROTATE;break;default:this.state=k.NONE}break;default:this.state=k.NONE}this.state!==k.NONE&&this.dispatchEvent(wt)}function vi(t){switch(this._trackPointer(t),this.state){case k.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(t),this.update();break;case k.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(t),this.update();break;case k.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(t),this.update();break;case k.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(t),this.update();break;default:this.state=k.NONE}}function mi(t){this.enabled!==!1&&t.preventDefault()}function _i(t){t.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function gi(t){t.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const yi=()=>$n("threlte-controls",{orbitControls:Ht(void 0),trackballControls:Ht(void 0)});function xi(t,e){ft(e,!0);const n=()=>Xn(s,"$parent",i),[i,o]=Gn();let r=Zn(e,"ref",15),a=Wn(e,["$$slots","$$events","$$legacy","ref","children"]);const s=In(),{dom:c,invalidate:l}=Kt();if(!qt(n(),"Camera"))throw new Error("Parent missing: <OrbitControls> need to be a child of a <Camera>");const v=new ai(n(),c),{orbitControls:y}=yi();An(()=>{v.update()},{running:()=>e.autoRotate??e.enableDamping??!1}),mn(()=>{const _=E=>{l(),e.onchange?.(E)};return y.set(v),v.addEventListener("change",_),()=>{y.set(void 0),v.removeEventListener("change",_)}}),D(t,Bn({get is(){return v}},()=>a,{get ref(){return r()},set ref(_){r(_)},children:(_,E)=>{var S=_n(),Y=re(S);Yn(Y,()=>e.children??gn,()=>({ref:v})),$(_,S)},$$slots:{default:!0}})),pt(),o()}new Ne;new Ne;new Qt;`${ge.logdepthbuf_pars_vertex}${ge.fog_pars_vertex}${ge.logdepthbuf_vertex}${ge.fog_vertex}`;`${ge.tonemapping_fragment}${ge.colorspace_fragment}`;`${ge.tonemapping_fragment}${ge.colorspace_fragment}`;const bi=`

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
`;`${Mi}${Si}${ge.tonemapping_fragment}${ge.colorspace_fragment}`;new Ke;typeof window<"u"&&document.createElement("div");const Pi=t=>{const{camera:e}=Kt();let n=t.current.clientWidth,i=t.current.clientHeight;const o=new ResizeObserver(([r])=>{n=r.contentRect.width,i=r.contentRect.height});return Jt(t,r=>(r&&o.observe(r),()=>{r&&o.unobserve(r)})),(r,a)=>{a.pointer.update(s=>(s.set(r.offsetX/n*2-1,-(r.offsetY/i)*2+1),s)),a.raycaster.setFromCamera(a.pointer.current,e.current)}},nn=Symbol("interactivity-context"),Ei=()=>$t(nn),Ci=t=>{const e=me(jn().dom),n={enabled:me(!0),pointer:me(new se),pointerOverTarget:me(!1),lastEvent:void 0,raycaster:new Nn,initialClick:[0,0],initialHits:[],hovered:new Map,interactiveObjects:[],target:e,handlers:new WeakMap,compute:Pi(e),filter:t?.filter,addInteractiveObject:(i,o)=>{n.interactiveObjects.indexOf(i)>-1||(n.handlers.set(i,o),n.interactiveObjects.push(i))},removeInteractiveObject:i=>{const o=n.interactiveObjects.indexOf(i);n.interactiveObjects.splice(o,1),n.handlers.delete(i)}};return Vt(nn,n),n},on=()=>{const t=Ei();if(!t)throw new Error("No interactivity context found. Did you forget to implement interactivity()?");return t},Zt=["onclick","oncontextmenu","ondblclick","onwheel","onpointerup","onpointerdown","onpointerover","onpointerout","onpointerenter","onpointerleave","onpointermove","onpointermissed"],Oi=()=>{Vn("interactivity",t=>{if(!qt(t.ref,"Object3D")||!Object.entries(t.props).some(([o,r])=>r!==void 0&&Zt.includes(o)))return;const{addInteractiveObject:n,removeInteractiveObject:i}=on();return Ln.pre(()=>[t.ref],([o])=>(n(o,t.props),()=>{i(o)})),{pluginProps:Zt}})};function Bt(t){return`${(t.eventObject||t.object).uuid}|${t.index}|${t.instanceId}`}const Xt=[["click",!1],["contextmenu",!1],["dblclick",!1],["wheel",!1],["pointerdown",!0],["pointerup",!0],["pointerleave",!0],["pointerenter",!0],["pointermove",!0],["pointercancel",!0]],Ti=t=>{const{handlers:e}=on(),n=d=>{const u=d.offsetX-t.initialClick[0],h=d.offsetY-t.initialClick[1];return Math.round(Math.hypot(u,h))},i=d=>{if(t.hovered.size===0)return;const u=new Set;for(const h of d)u.add(Bt(h));for(const[h,f]of t.hovered)if(!u.has(h)){const{eventObject:w}=f;t.hovered.delete(h);const ae=e.get(w);if(ae){const G={...f,intersections:d};ae.onpointerout?.(G),ae.onpointerleave?.(G)}}},o=()=>{if(!t.enabled.current)return[];const d=[],u=t.raycaster.intersectObjects(t.interactiveObjects,!0),h=t.filter===void 0?u:t.filter(u,t);for(const f of h){let w=f.object;for(;w;)e.has(w)&&d.push({...f,eventObject:w}),w=w.parent}return d},r=(d,u)=>{for(const h of u)e.get(h)?.onpointermissed?.(d)},a=()=>{t.pointerOverTarget.set(!1),i([])},s=()=>{t.pointerOverTarget.set(!0)},c=d=>{const u=d.type,h=u==="pointermove",f=u==="click"||u==="contextmenu"||u==="dblclick";t.compute(d,t);const w=o(),ae=f?n(d):0;u==="pointerdown"&&(t.initialClick=[d.offsetX,d.offsetY],t.initialHits=w.map(N=>N.eventObject)),f&&w.length===0&&ae<=2&&r(d,t.interactiveObjects),h&&i(w);let G=!1;e:for(const N of w){const q=e.get(N.eventObject);if(!q)continue;const ie={stopped:G,...N,intersections:w,stopPropagation(){if(G=!0,ie.stopped=!0,t.hovered.size>0&&Array.from(t.hovered.values()).some(B=>B.eventObject===N.eventObject)){const B=w.slice(0,w.indexOf(N));i([...B,N])}},camera:t.raycaster.camera,delta:ae,nativeEvent:d,pointer:t.pointer.current,ray:t.raycaster.ray};if(h){if(q.onpointerover||q.onpointerenter||q.onpointerout||q.onpointerleave){const B=Bt(ie),ye=t.hovered.get(B);ye?ye.stopped&&ie.stopPropagation():(t.hovered.set(B,ie),q.onpointerover?.(ie),q.onpointerenter?.(ie))}q.onpointermove?.(ie)}else q[`on${u}`]?(!f||t.initialHits.includes(N.eventObject))&&(r(d,t.interactiveObjects.filter(B=>!t.initialHits.includes(B))),q[`on${u}`]?.(ie)):f&&t.initialHits.includes(N.eventObject)&&r(d,t.interactiveObjects.filter(B=>!t.initialHits.includes(B)));if(G)break e}};let l=0,v=null,y=-1/0,_=-1/0;const E=.25,S=d=>{Math.abs(d.offsetX-y)<E&&Math.abs(d.offsetY-_)<E||(y=d.offsetX,_=d.offsetY,v=d,l||(l=requestAnimationFrame(()=>{l=0,v&&(c(v),v=null)})))},Y=d=>{for(const[u]of Xt)u==="pointerleave"||u==="pointercancel"?d.removeEventListener(u,a):u==="pointermove"?d.removeEventListener(u,S):u==="pointerenter"?d.removeEventListener(u,s):d.removeEventListener(u,c)},W=d=>{for(const[u,h]of Xt)u==="pointerleave"||u==="pointercancel"?d.addEventListener(u,a,{passive:h}):u==="pointermove"?d.addEventListener(u,S,{passive:h}):u==="pointerenter"?d.addEventListener(u,s,{passive:h}):d.addEventListener(u,c,{passive:h})};Jt(t.target,d=>(d&&W(d),()=>{d&&Y(d)}))},Ii=t=>{const e=Ci(t);return Oi(),Ti(e),e};for(let t=0;t<256;t++)(t<16?"0":"")+t.toString(16);new kn(-1,1,1,-1,0,1);class Ai extends zn{constructor(){super(),this.setAttribute("position",new Ut([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Ut([0,2,0,0,2,0],2))}}new Ai;var rn={exports:{}};rn.exports=Qe;rn.exports.default=Qe;function Qe(t,e,n){n=n||2;var i=e&&e.length,o=i?e[0]*n:t.length,r=an(t,0,o,n,!0),a=[];if(!r||r.next===r.prev)return a;var s,c,l,v,y,_,E;if(i&&(r=zi(t,e,r,n)),t.length>80*n){s=l=t[0],c=v=t[1];for(var S=n;S<o;S+=n)y=t[S],_=t[S+1],y<s&&(s=y),_<c&&(c=_),y>l&&(l=y),_>v&&(v=_);E=Math.max(l-s,v-c),E=E!==0?32767/E:0}return ke(r,a,n,s,c,E,0),a}function an(t,e,n,i,o){var r,a;if(o===ut(t,e,n,i)>0)for(r=e;r<n;r+=i)a=Gt(r,t[r],t[r+1],a);else for(r=n-i;r>=e;r-=i)a=Gt(r,t[r],t[r+1],a);return a&&Je(a,a.next)&&(Re(a),a=a.next),a}function Se(t,e){if(!t)return t;e||(e=t);var n=t,i;do if(i=!1,!n.steiner&&(Je(n,n.next)||X(n.prev,n,n.next)===0)){if(Re(n),n=e=n.prev,n===n.next)break;i=!0}else n=n.next;while(i||n!==e);return e}function ke(t,e,n,i,o,r,a){if(t){!a&&r&&Fi(t,i,o,r);for(var s=t,c,l;t.prev!==t.next;){if(c=t.prev,l=t.next,r?Ni(t,i,o,r):ji(t)){e.push(c.i/n|0),e.push(t.i/n|0),e.push(l.i/n|0),Re(t),t=l.next,s=l.next;continue}if(t=l,t===s){a?a===1?(t=Li(Se(t),e,n),ke(t,e,n,i,o,r,2)):a===2&&ki(t,e,n,i,o,r):ke(Se(t),e,n,i,o,r,1);break}}}}function ji(t){var e=t.prev,n=t,i=t.next;if(X(e,n,i)>=0)return!1;for(var o=e.x,r=n.x,a=i.x,s=e.y,c=n.y,l=i.y,v=o<r?o<a?o:a:r<a?r:a,y=s<c?s<l?s:l:c<l?c:l,_=o>r?o>a?o:a:r>a?r:a,E=s>c?s>l?s:l:c>l?c:l,S=i.next;S!==e;){if(S.x>=v&&S.x<=_&&S.y>=y&&S.y<=E&&Ae(o,s,r,c,a,l,S.x,S.y)&&X(S.prev,S,S.next)>=0)return!1;S=S.next}return!0}function Ni(t,e,n,i){var o=t.prev,r=t,a=t.next;if(X(o,r,a)>=0)return!1;for(var s=o.x,c=r.x,l=a.x,v=o.y,y=r.y,_=a.y,E=s<c?s<l?s:l:c<l?c:l,S=v<y?v<_?v:_:y<_?y:_,Y=s>c?s>l?s:l:c>l?c:l,W=v>y?v>_?v:_:y>_?y:_,d=dt(E,S,e,n,i),u=dt(Y,W,e,n,i),h=t.prevZ,f=t.nextZ;h&&h.z>=d&&f&&f.z<=u;){if(h.x>=E&&h.x<=Y&&h.y>=S&&h.y<=W&&h!==o&&h!==a&&Ae(s,v,c,y,l,_,h.x,h.y)&&X(h.prev,h,h.next)>=0||(h=h.prevZ,f.x>=E&&f.x<=Y&&f.y>=S&&f.y<=W&&f!==o&&f!==a&&Ae(s,v,c,y,l,_,f.x,f.y)&&X(f.prev,f,f.next)>=0))return!1;f=f.nextZ}for(;h&&h.z>=d;){if(h.x>=E&&h.x<=Y&&h.y>=S&&h.y<=W&&h!==o&&h!==a&&Ae(s,v,c,y,l,_,h.x,h.y)&&X(h.prev,h,h.next)>=0)return!1;h=h.prevZ}for(;f&&f.z<=u;){if(f.x>=E&&f.x<=Y&&f.y>=S&&f.y<=W&&f!==o&&f!==a&&Ae(s,v,c,y,l,_,f.x,f.y)&&X(f.prev,f,f.next)>=0)return!1;f=f.nextZ}return!0}function Li(t,e,n){var i=t;do{var o=i.prev,r=i.next.next;!Je(o,r)&&sn(o,i,i.next,r)&&ze(o,r)&&ze(r,o)&&(e.push(o.i/n|0),e.push(i.i/n|0),e.push(r.i/n|0),Re(i),Re(i.next),i=t=r),i=i.next}while(i!==t);return Se(i)}function ki(t,e,n,i,o,r){var a=t;do{for(var s=a.next.next;s!==a.prev;){if(a.i!==s.i&&Xi(a,s)){var c=ln(a,s);a=Se(a,a.next),c=Se(c,c.next),ke(a,e,n,i,o,r,0),ke(c,e,n,i,o,r,0);return}s=s.next}a=a.next}while(a!==t)}function zi(t,e,n,i){var o=[],r,a,s,c,l;for(r=0,a=e.length;r<a;r++)s=e[r]*i,c=r<a-1?e[r+1]*i:t.length,l=an(t,s,c,i,!1),l===l.next&&(l.steiner=!0),o.push(Bi(l));for(o.sort(Ri),r=0;r<o.length;r++)n=Ui(o[r],n);return n}function Ri(t,e){return t.x-e.x}function Ui(t,e){var n=Hi(t,e);if(!n)return e;var i=ln(n,t);return Se(i,i.next),Se(n,n.next)}function Hi(t,e){var n=e,i=t.x,o=t.y,r=-1/0,a;do{if(o<=n.y&&o>=n.next.y&&n.next.y!==n.y){var s=n.x+(o-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(s<=i&&s>r&&(r=s,a=n.x<n.next.x?n:n.next,s===i))return a}n=n.next}while(n!==e);if(!a)return null;var c=a,l=a.x,v=a.y,y=1/0,_;n=a;do i>=n.x&&n.x>=l&&i!==n.x&&Ae(o<v?i:r,o,l,v,o<v?r:i,o,n.x,n.y)&&(_=Math.abs(o-n.y)/(i-n.x),ze(n,t)&&(_<y||_===y&&(n.x>a.x||n.x===a.x&&Yi(a,n)))&&(a=n,y=_)),n=n.next;while(n!==c);return a}function Yi(t,e){return X(t.prev,t,e.prev)<0&&X(e.next,t,t.next)<0}function Fi(t,e,n,i){var o=t;do o.z===0&&(o.z=dt(o.x,o.y,e,n,i)),o.prevZ=o.prev,o.nextZ=o.next,o=o.next;while(o!==t);o.prevZ.nextZ=null,o.prevZ=null,Zi(o)}function Zi(t){var e,n,i,o,r,a,s,c,l=1;do{for(n=t,t=null,r=null,a=0;n;){for(a++,i=n,s=0,e=0;e<l&&(s++,i=i.nextZ,!!i);e++);for(c=l;s>0||c>0&&i;)s!==0&&(c===0||!i||n.z<=i.z)?(o=n,n=n.nextZ,s--):(o=i,i=i.nextZ,c--),r?r.nextZ=o:t=o,o.prevZ=r,r=o;n=i}r.nextZ=null,l*=2}while(a>1);return t}function dt(t,e,n,i,o){return t=(t-n)*o|0,e=(e-i)*o|0,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t|e<<1}function Bi(t){var e=t,n=t;do(e.x<n.x||e.x===n.x&&e.y<n.y)&&(n=e),e=e.next;while(e!==t);return n}function Ae(t,e,n,i,o,r,a,s){return(o-a)*(e-s)>=(t-a)*(r-s)&&(t-a)*(i-s)>=(n-a)*(e-s)&&(n-a)*(r-s)>=(o-a)*(i-s)}function Xi(t,e){return t.next.i!==e.i&&t.prev.i!==e.i&&!Gi(t,e)&&(ze(t,e)&&ze(e,t)&&Wi(t,e)&&(X(t.prev,t,e.prev)||X(t,e.prev,e))||Je(t,e)&&X(t.prev,t,t.next)>0&&X(e.prev,e,e.next)>0)}function X(t,e,n){return(e.y-t.y)*(n.x-e.x)-(e.x-t.x)*(n.y-e.y)}function Je(t,e){return t.x===e.x&&t.y===e.y}function sn(t,e,n,i){var o=Ve(X(t,e,n)),r=Ve(X(t,e,i)),a=Ve(X(n,i,t)),s=Ve(X(n,i,e));return!!(o!==r&&a!==s||o===0&&We(t,n,e)||r===0&&We(t,i,e)||a===0&&We(n,t,i)||s===0&&We(n,e,i))}function We(t,e,n){return e.x<=Math.max(t.x,n.x)&&e.x>=Math.min(t.x,n.x)&&e.y<=Math.max(t.y,n.y)&&e.y>=Math.min(t.y,n.y)}function Ve(t){return t>0?1:t<0?-1:0}function Gi(t,e){var n=t;do{if(n.i!==t.i&&n.next.i!==t.i&&n.i!==e.i&&n.next.i!==e.i&&sn(n,n.next,t,e))return!0;n=n.next}while(n!==t);return!1}function ze(t,e){return X(t.prev,t,t.next)<0?X(t,e,t.next)>=0&&X(t,t.prev,e)>=0:X(t,e,t.prev)<0||X(t,t.next,e)<0}function Wi(t,e){var n=t,i=!1,o=(t.x+e.x)/2,r=(t.y+e.y)/2;do n.y>r!=n.next.y>r&&n.next.y!==n.y&&o<(n.next.x-n.x)*(r-n.y)/(n.next.y-n.y)+n.x&&(i=!i),n=n.next;while(n!==t);return i}function ln(t,e){var n=new ht(t.i,t.x,t.y),i=new ht(e.i,e.x,e.y),o=t.next,r=e.prev;return t.next=e,e.prev=t,n.next=o,o.prev=n,i.next=n,n.prev=i,r.next=i,i.prev=r,i}function Gt(t,e,n,i){var o=new ht(t,e,n);return i?(o.next=i.next,o.prev=i,i.next.prev=o,i.next=o):(o.prev=o,o.next=o),o}function Re(t){t.next.prev=t.prev,t.prev.next=t.next,t.prevZ&&(t.prevZ.nextZ=t.nextZ),t.nextZ&&(t.nextZ.prevZ=t.prevZ)}function ht(t,e,n){this.i=t,this.x=e,this.y=n,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}Qe.deviation=function(t,e,n,i){var o=e&&e.length,r=o?e[0]*n:t.length,a=Math.abs(ut(t,0,r,n));if(o)for(var s=0,c=e.length;s<c;s++){var l=e[s]*n,v=s<c-1?e[s+1]*n:t.length;a-=Math.abs(ut(t,l,v,n))}var y=0;for(s=0;s<i.length;s+=3){var _=i[s]*n,E=i[s+1]*n,S=i[s+2]*n;y+=Math.abs((t[_]-t[S])*(t[E+1]-t[_+1])-(t[_]-t[E])*(t[S+1]-t[_+1]))}return a===0&&y===0?0:Math.abs((y-a)/a)};function ut(t,e,n,i){for(var o=0,r=e,a=n-i;r<n;r+=i)o+=(t[a]-t[r])*(t[r+1]+t[a+1]),a=r;return o}Qe.flatten=function(t){for(var e=t[0][0].length,n={vertices:[],holes:[],dimensions:e},i=0,o=0;o<t.length;o++){for(var r=0;r<t[o].length;r++)for(var a=0;a<e;a++)n.vertices.push(t[o][r][a]);o>0&&(i+=t[o-1].length,n.holes.push(i))}return n};new se;new se;var Wt;(t=>{function e(o){let r=o.slice();return r.sort(t.POINT_COMPARATOR),t.makeHullPresorted(r)}t.makeHull=e;function n(o){if(o.length<=1)return o.slice();let r=[];for(let s=0;s<o.length;s++){const c=o[s];for(;r.length>=2;){const l=r[r.length-1],v=r[r.length-2];if((l.x-v.x)*(c.y-v.y)>=(l.y-v.y)*(c.x-v.x))r.pop();else break}r.push(c)}r.pop();let a=[];for(let s=o.length-1;s>=0;s--){const c=o[s];for(;a.length>=2;){const l=a[a.length-1],v=a[a.length-2];if((l.x-v.x)*(c.y-v.y)>=(l.y-v.y)*(c.x-v.x))a.pop();else break}a.push(c)}return a.pop(),r.length==1&&a.length==1&&r[0].x==a[0].x&&r[0].y==a[0].y?r:r.concat(a)}t.makeHullPresorted=n;function i(o,r){return o.x<r.x?-1:o.x>r.x?1:o.y<r.y?-1:o.y>r.y?1:0}t.POINT_COMPARATOR=i})(Wt||(Wt={}));new Rn;new I;new Ne;new mt;new vt;new Ke;new I;new I;var Vi=K("<!> <!>",1),$i=K("<!> <!>",1),Ki=K("<!> <!>",1),qi=K("<!> <!>",1),Qi=K("<!> <!>",1),Ji=K("<!> <!>",1),eo=K("<!> <!>",1),to=K("<!> <!>",1),no=K("<!> <!>",1),io=K("<!> <!>",1),oo=K("<!> <!>",1),ro=K("<!> <!>",1),ao=K("<!> <!>",1),so=K("<!> <!>",1),lo=K("<!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!>",1),co=K("<!> <!> <!> <!> <!> <!> <!>",1);function ho(t,e){ft(e,!0),Ii();let n=we(!1),i=we(!0);const o=20,r=20,a="#374151",s="#1f2937",c=.08,l=.45,v=.2,y=.3,_="#facc15",E=20;let S=!1,Y,W=1,d="x",u=0,h=0,f=!1;function w(F,R,Q,oe){oe.stopPropagation(),F&&(S=!0,Y=F,W=Q,d=R,f=!1,h=0,u=R==="x"?oe.event?.clientX??0:oe.event?.clientY??0,ee(i,!1),document.addEventListener("pointermove",ae),document.addEventListener("pointerup",G,{once:!0}))}function ae(F){if(!S)return;const R=d==="x"?F.clientX:F.clientY,Q=R-u;u=R;const oe=d==="y"?-Q:Q;for(h+=oe;h>=E;)Y?.(1),h-=E,f=!0;for(;h<=-E;)Y?.(-1),h+=E,f=!0}function G(){S=!1,ee(i,!0),document.removeEventListener("pointermove",ae),!f&&Y&&(Y(W),f=!0),Y=void 0}function N(F,R,Q){if(f){f=!1;return}F.stopPropagation(),R?.(Q)}yn(()=>()=>{document.removeEventListener("pointermove",ae)});var q=co(),ie=re(q);M(ie,()=>D.PerspectiveCamera,(F,R)=>{R(F,{makeDefault:!0,position:[50,35,55],fov:45,children:(Q,oe)=>{xi(Q,{enableDamping:!0,dampingFactor:.05,get enabled(){return m(i)}})},$$slots:{default:!0}})});var B=g(ie,2);M(B,()=>D.AmbientLight,(F,R)=>{R(F,{intensity:.5})});var ye=g(B,2);M(ye,()=>D.DirectionalLight,(F,R)=>{R(F,{position:[5,10,5],intensity:1.2,castShadow:!0})});var Pe=g(ye,2);M(Pe,()=>D.GridHelper,(F,R)=>{R(F,{args:[o,r,a,s],position:[0,0,0]})});var Ee=g(Pe,2);{let F=te(()=>[0,e.dimY/2,0]);M(Ee,()=>D.Mesh,(R,Q)=>{Q(R,{get position(){return m(F)},castShadow:!0,receiveShadow:!0,onclick:oe=>{oe.stopPropagation(),ee(n,!m(n))},children:(oe,De)=>{var he=Vi(),ue=re(he);{let le=te(()=>[e.dimX,e.dimY,e.dimZ]);M(ue,()=>D.BoxGeometry,(de,fe)=>{fe(de,{get args(){return m(le)}})})}var xe=g(ue,2);{let le=te(()=>m(n)?"#86efac":"#4ade80");M(xe,()=>D.MeshStandardMaterial,(de,fe)=>{fe(de,{get color(){return m(le)},metalness:.3,roughness:.5})})}$(oe,he)},$$slots:{default:!0}})})}var Ce=g(Ee,2);{let F=te(()=>[0,e.dimY/2,0]);M(Ce,()=>D.Mesh,(R,Q)=>{Q(R,{get position(){return m(F)},children:(oe,De)=>{var he=$i(),ue=re(he);{let le=te(()=>[e.dimX,e.dimY,e.dimZ]);M(ue,()=>D.BoxGeometry,(de,fe)=>{fe(de,{get args(){return m(le)}})})}var xe=g(ue,2);M(xe,()=>D.MeshBasicMaterial,(le,de)=>{de(le,{color:"#166534",wireframe:!0})}),$(oe,he)},$$slots:{default:!0}})})}var Ye=g(Ce,2);{var et=F=>{var R=lo(),Q=re(R);{let U=te(()=>[e.dimX/2+l/2,e.dimY/2,0]);M(Q,()=>D.Mesh,(H,T)=>{T(H,{get position(){return m(U)},rotation:[0,0,-Math.PI/2],onclick:p=>N(p,e.onAdjustX,1),onpointerdown:p=>w(e.onAdjustX,"x",1,p),children:(p,ne)=>{var C=Ki(),O=re(C);M(O,()=>D.CylinderGeometry,(b,P)=>{P(b,{args:[c,c,l,8]})});var j=g(O,2);M(j,()=>D.MeshStandardMaterial,(b,P)=>{P(b,{color:_})}),$(p,C)},$$slots:{default:!0}})})}var oe=g(Q,2);{let U=te(()=>[e.dimX/2+l+y/2,e.dimY/2,0]);M(oe,()=>D.Mesh,(H,T)=>{T(H,{get position(){return m(U)},rotation:[0,0,-Math.PI/2],onclick:p=>N(p,e.onAdjustX,1),onpointerdown:p=>w(e.onAdjustX,"x",1,p),children:(p,ne)=>{var C=qi(),O=re(C);M(O,()=>D.ConeGeometry,(b,P)=>{P(b,{args:[v,y,8]})});var j=g(O,2);M(j,()=>D.MeshStandardMaterial,(b,P)=>{P(b,{color:_})}),$(p,C)},$$slots:{default:!0}})})}var De=g(oe,2);{let U=te(()=>[-e.dimX/2-l/2,e.dimY/2,0]);M(De,()=>D.Mesh,(H,T)=>{T(H,{get position(){return m(U)},rotation:[0,0,Math.PI/2],onclick:p=>N(p,e.onAdjustX,-1),onpointerdown:p=>w(e.onAdjustX,"x",-1,p),children:(p,ne)=>{var C=Qi(),O=re(C);M(O,()=>D.CylinderGeometry,(b,P)=>{P(b,{args:[c,c,l,8]})});var j=g(O,2);M(j,()=>D.MeshStandardMaterial,(b,P)=>{P(b,{color:_})}),$(p,C)},$$slots:{default:!0}})})}var he=g(De,2);{let U=te(()=>[-e.dimX/2-l-y/2,e.dimY/2,0]);M(he,()=>D.Mesh,(H,T)=>{T(H,{get position(){return m(U)},rotation:[0,0,Math.PI/2],onclick:p=>N(p,e.onAdjustX,-1),onpointerdown:p=>w(e.onAdjustX,"x",-1,p),children:(p,ne)=>{var C=Ji(),O=re(C);M(O,()=>D.ConeGeometry,(b,P)=>{P(b,{args:[v,y,8]})});var j=g(O,2);M(j,()=>D.MeshStandardMaterial,(b,P)=>{P(b,{color:_})}),$(p,C)},$$slots:{default:!0}})})}var ue=g(he,2);{let U=te(()=>[0,e.dimY+l/2,0]);M(ue,()=>D.Mesh,(H,T)=>{T(H,{get position(){return m(U)},onclick:p=>N(p,e.onAdjustY,1),onpointerdown:p=>w(e.onAdjustY,"y",1,p),children:(p,ne)=>{var C=eo(),O=re(C);M(O,()=>D.CylinderGeometry,(b,P)=>{P(b,{args:[c,c,l,8]})});var j=g(O,2);M(j,()=>D.MeshStandardMaterial,(b,P)=>{P(b,{color:_})}),$(p,C)},$$slots:{default:!0}})})}var xe=g(ue,2);{let U=te(()=>[0,e.dimY+l+y/2,0]);M(xe,()=>D.Mesh,(H,T)=>{T(H,{get position(){return m(U)},onclick:p=>N(p,e.onAdjustY,1),onpointerdown:p=>w(e.onAdjustY,"y",1,p),children:(p,ne)=>{var C=to(),O=re(C);M(O,()=>D.ConeGeometry,(b,P)=>{P(b,{args:[v,y,8]})});var j=g(O,2);M(j,()=>D.MeshStandardMaterial,(b,P)=>{P(b,{color:_})}),$(p,C)},$$slots:{default:!0}})})}var le=g(xe,2);M(le,()=>D.Mesh,(U,H)=>{H(U,{position:[0,-l/2,0],rotation:[0,0,Math.PI],onclick:T=>N(T,e.onAdjustY,-1),onpointerdown:T=>w(e.onAdjustY,"y",-1,T),children:(T,p)=>{var ne=no(),C=re(ne);M(C,()=>D.CylinderGeometry,(j,b)=>{b(j,{args:[c,c,l,8]})});var O=g(C,2);M(O,()=>D.MeshStandardMaterial,(j,b)=>{b(j,{color:_})}),$(T,ne)},$$slots:{default:!0}})});var de=g(le,2);M(de,()=>D.Mesh,(U,H)=>{H(U,{position:[0,-l-y/2,0],rotation:[0,0,Math.PI],onclick:T=>N(T,e.onAdjustY,-1),onpointerdown:T=>w(e.onAdjustY,"y",-1,T),children:(T,p)=>{var ne=io(),C=re(ne);M(C,()=>D.ConeGeometry,(j,b)=>{b(j,{args:[v,y,8]})});var O=g(C,2);M(O,()=>D.MeshStandardMaterial,(j,b)=>{b(j,{color:_})}),$(T,ne)},$$slots:{default:!0}})});var fe=g(de,2);{let U=te(()=>[0,e.dimY/2,e.dimZ/2+l/2]);M(fe,()=>D.Mesh,(H,T)=>{T(H,{get position(){return m(U)},rotation:[Math.PI/2,0,0],onclick:p=>N(p,e.onAdjustZ,1),onpointerdown:p=>w(e.onAdjustZ,"x",1,p),children:(p,ne)=>{var C=oo(),O=re(C);M(O,()=>D.CylinderGeometry,(b,P)=>{P(b,{args:[c,c,l,8]})});var j=g(O,2);M(j,()=>D.MeshStandardMaterial,(b,P)=>{P(b,{color:_})}),$(p,C)},$$slots:{default:!0}})})}var Oe=g(fe,2);{let U=te(()=>[0,e.dimY/2,e.dimZ/2+l+y/2]);M(Oe,()=>D.Mesh,(H,T)=>{T(H,{get position(){return m(U)},rotation:[Math.PI/2,0,0],onclick:p=>N(p,e.onAdjustZ,1),onpointerdown:p=>w(e.onAdjustZ,"x",1,p),children:(p,ne)=>{var C=ro(),O=re(C);M(O,()=>D.ConeGeometry,(b,P)=>{P(b,{args:[v,y,8]})});var j=g(O,2);M(j,()=>D.MeshStandardMaterial,(b,P)=>{P(b,{color:_})}),$(p,C)},$$slots:{default:!0}})})}var Fe=g(Oe,2);{let U=te(()=>[0,e.dimY/2,-e.dimZ/2-l/2]);M(Fe,()=>D.Mesh,(H,T)=>{T(H,{get position(){return m(U)},rotation:[-Math.PI/2,0,0],onclick:p=>N(p,e.onAdjustZ,-1),onpointerdown:p=>w(e.onAdjustZ,"x",-1,p),children:(p,ne)=>{var C=ao(),O=re(C);M(O,()=>D.CylinderGeometry,(b,P)=>{P(b,{args:[c,c,l,8]})});var j=g(O,2);M(j,()=>D.MeshStandardMaterial,(b,P)=>{P(b,{color:_})}),$(p,C)},$$slots:{default:!0}})})}var Ze=g(Fe,2);{let U=te(()=>[0,e.dimY/2,-e.dimZ/2-l-y/2]);M(Ze,()=>D.Mesh,(H,T)=>{T(H,{get position(){return m(U)},rotation:[-Math.PI/2,0,0],onclick:p=>N(p,e.onAdjustZ,-1),onpointerdown:p=>w(e.onAdjustZ,"x",-1,p),children:(p,ne)=>{var C=so(),O=re(C);M(O,()=>D.ConeGeometry,(b,P)=>{P(b,{args:[v,y,8]})});var j=g(O,2);M(j,()=>D.MeshStandardMaterial,(b,P)=>{P(b,{color:_})}),$(p,C)},$$slots:{default:!0}})})}$(F,R)};ct(Ye,F=>{m(n)&&F(et)})}$(t,q),pt()}class uo{parse(e,n={}){n=Object.assign({binary:!1},n);const i=n.binary,o=[];let r=0;e.traverse(function(d){if(d.isMesh){const u=d.geometry,h=u.index,f=u.getAttribute("position");r+=h!==null?h.count/3:f.count/3,o.push({object3d:d,geometry:u})}});let a,s=80;if(i===!0){const d=r*2+r*3*4*4+80+4,u=new ArrayBuffer(d);a=new DataView(u),a.setUint32(s,r,!0),s+=4}else a="",a+=`solid exported
`;const c=new I,l=new I,v=new I,y=new I,_=new I,E=new I;for(let d=0,u=o.length;d<u;d++){const h=o[d].object3d,f=o[d].geometry,w=f.index,ae=f.getAttribute("position");if(w!==null)for(let G=0;G<w.count;G+=3){const N=w.getX(G+0),q=w.getX(G+1),ie=w.getX(G+2);S(N,q,ie,ae,h)}else for(let G=0;G<ae.count;G+=3){const N=G+0,q=G+1,ie=G+2;S(N,q,ie,ae,h)}}return i===!1&&(a+=`endsolid exported
`),a;function S(d,u,h,f,w){c.fromBufferAttribute(f,d),l.fromBufferAttribute(f,u),v.fromBufferAttribute(f,h),w.isSkinnedMesh===!0&&(w.applyBoneTransform(d,c),w.applyBoneTransform(u,l),w.applyBoneTransform(h,v)),c.applyMatrix4(w.matrixWorld),l.applyMatrix4(w.matrixWorld),v.applyMatrix4(w.matrixWorld),Y(c,l,v),W(c),W(l),W(v),i===!0?(a.setUint16(s,0,!0),s+=2):(a+=`		endloop
`,a+=`	endfacet
`)}function Y(d,u,h){y.subVectors(h,u),_.subVectors(d,u),y.cross(_).normalize(),E.copy(y).normalize(),i===!0?(a.setFloat32(s,E.x,!0),s+=4,a.setFloat32(s,E.y,!0),s+=4,a.setFloat32(s,E.z,!0),s+=4):(a+="	facet normal "+E.x+" "+E.y+" "+E.z+`
`,a+=`		outer loop
`)}function W(d){i===!0?(a.setFloat32(s,d.x,!0),s+=4,a.setFloat32(s,d.y,!0),s+=4,a.setFloat32(s,d.z,!0),s+=4):a+="			vertex "+d.x+" "+d.y+" "+d.z+`
`}}}var fo=K("<button> </button>"),po=K('<button class="ml-3 underline opacity-70 hover:opacity-100">Dismiss</button>'),vo=K("<div> <!></div>"),mo=K('<div class="flex flex-col gap-6 w-full"><div class="flex flex-wrap items-center gap-6"><div class="flex items-center gap-3"><span class="text-sm font-medium text-gray-400">Units:</span> <div class="flex rounded-lg overflow-hidden border border-gray-600"><button>mm</button> <button>in</button></div></div> <div class="flex items-center gap-3"><span class="text-sm font-medium text-gray-400"> </span> <div class="flex rounded-lg overflow-hidden border border-gray-600"></div></div> <div class="flex items-center gap-3 ml-auto"><button class="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors" title="Export 3D model as STL file"><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg> Download</button> <button class="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors" title="Upload STL, metadata and preview to Nextcloud"><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd"></path></svg> </button></div></div> <!> <div class="flex flex-wrap gap-4 text-xs font-mono text-gray-500"><span> </span> <span>|</span> <span> </span></div> <div class="relative w-full rounded-xl overflow-hidden border border-gray-700" style="height: 480px;"><!> <div class="absolute bottom-4 left-4 z-10 bg-gray-900/80 backdrop-blur-sm rounded-xl p-3 border border-gray-700 select-none"><p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Adjust</p> <div class="flex flex-col gap-2"><div class="flex items-center gap-2"><span class="w-20 text-xs text-gray-300">Width (X)</span> <button class="w-10 h-10 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 active:bg-green-500 text-white text-lg transition-colors [touch-action:manipulation]" aria-label="Decrease width">←</button> <button class="w-10 h-10 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 active:bg-green-500 text-white text-lg transition-colors [touch-action:manipulation]" aria-label="Increase width">→</button></div> <div class="flex items-center gap-2"><span class="w-20 text-xs text-gray-300">Height (Y)</span> <button class="w-10 h-10 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 active:bg-green-500 text-white text-lg transition-colors [touch-action:manipulation]" aria-label="Decrease height">↓</button> <button class="w-10 h-10 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 active:bg-green-500 text-white text-lg transition-colors [touch-action:manipulation]" aria-label="Increase height">↑</button></div> <div class="flex items-center gap-2"><span class="w-20 text-xs text-gray-300">Length (Z)</span> <button class="w-10 h-10 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 active:bg-green-500 text-white text-lg transition-colors [touch-action:manipulation]" aria-label="Decrease length">←</button> <button class="w-10 h-10 flex items-center justify-center rounded bg-gray-700 hover:bg-green-600 active:bg-green-500 text-white text-lg transition-colors [touch-action:manipulation]" aria-label="Increase length">→</button></div></div></div> <div class="absolute bottom-4 right-4 z-10 bg-gray-900/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-700"><p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Dimensions</p> <div class="flex flex-col gap-1 font-mono text-sm"><div class="flex gap-3"><span class="text-gray-500 w-4">W</span> <span class="text-green-400"> </span></div> <div class="flex gap-3"><span class="text-gray-500 w-4">L</span> <span class="text-green-400"> </span></div> <div class="flex gap-3"><span class="text-gray-500 w-4">H</span> <span class="text-green-400"> </span></div></div></div></div></div>');function Co(t,e){ft(e,!0);const n="/api/webdav",i=1/25,o=1/25.4,r=[.1,1,2.5,5,10],a=[.004,.04,.1,.5,1].map(x=>x*25.4),s=1,c=.1*25.4,l=100,v=950,y=100,_=1200,E=10,S=150;let Y=we(310),W=we(405),d=we(120),u=we("mm"),h=we(1),f=we("idle"),w=we("");const ae={idle:"",uploading:"bg-blue-900/40 border-blue-700 text-blue-300",success:"bg-green-900/40 border-green-700 text-green-300",error:"bg-red-900/40 border-red-700 text-red-300"};let G=te(()=>ae[m(f)]),N=te(()=>m(Y)*i),q=te(()=>m(d)*i),ie=te(()=>m(W)*i);function B(x){return m(u)==="in"?(x*o).toFixed(3):x.toFixed(1)}function ye(x,A,Z){return Math.max(A,Math.min(Z,x))}function Pe(x){ee(Y,ye(m(Y)+m(h)*x,l,v),!0)}function Ee(x){ee(d,ye(m(d)+m(h)*x,E,S),!0)}function Ce(x){ee(W,ye(m(W)+m(h)*x,y,_),!0)}function Ye(){const x=new Hn(m(Y),m(d),m(W)),A=new Qt(x);return new uo().parse(A,{binary:!0})}function et(){const x=Ye(),A=new Blob([x.buffer],{type:"application/octet-stream"}),Z=URL.createObjectURL(A),V=document.createElement("a");V.href=Z,V.download="model.stl",document.body.appendChild(V),V.click(),document.body.removeChild(V),URL.revokeObjectURL(Z)}function F(){return new Promise(x=>{const A=document.querySelector("canvas");if(!A){x(null);return}A.toBlob(Z=>x(Z),"image/png")})}async function R(x){console.debug("[CNC] MKCOL",x);let A;try{A=await fetch(x,{method:"MKCOL"})}catch(Z){throw console.error("[CNC] MKCOL fetch failed (network error):",x,Z),Z}if(console.debug("[CNC] MKCOL response",x,A.status,A.statusText),!A.ok&&A.status!==405)throw new Error(`MKCOL ${x} → ${A.status} ${A.statusText}`)}async function Q(x,A,Z){console.debug("[CNC] PUT",x,"Content-Type:",Z);let V;try{V=await fetch(x,{method:"PUT",headers:{"Content-Type":Z},body:A})}catch(ve){throw console.error("[CNC] PUT fetch failed (network error):",x,ve),ve}if(console.debug("[CNC] PUT response",x,V.status,V.statusText),!V.ok)throw new Error(`PUT ${x} → ${V.status} ${V.statusText}`)}async function oe(){console.debug("[CNC] manufacture() called"),ee(f,"uploading"),ee(w,"Uploading to Nextcloud…");try{let x=localStorage.getItem("oakpine_user_id");x||(x="USER_"+Date.now(),localStorage.setItem("oakpine_user_id",x));const A="Project_"+crypto.randomUUID(),V=`${n}/CNC-Projects`,ve=`${V}/${x}`,_e=`${ve}/${A}`;await R(V),await R(ve),await R(_e);const Te=Ye();await Q(`${_e}/model.stl`,Te.buffer,"application/octet-stream");const at={created_at:new Date().toISOString(),dimensions:{width_mm:m(Y),length_mm:m(W),height_mm:m(d)},limits:{min:{width_mm:l,length_mm:y,height_mm:E},max:{width_mm:v,length_mm:_,height_mm:S}},unit:m(u)};await Q(`${_e}/metadata.json`,JSON.stringify(at,null,2),"application/json");const Be=await F();Be&&await Q(`${_e}/preview.png`,Be,"image/png"),ee(f,"success"),ee(w,`Uploaded to /CNC-Projects/${x}/${A}`)}catch(x){console.error("[CNC] manufacture() error:",x),ee(f,"error"),ee(w,x instanceof Error?x.message:"Upload failed",!0)}}var De=mo(),he=z(De),ue=z(he),xe=g(z(ue),2),le=z(xe),de=g(le,2);L(xe),L(ue);var fe=g(ue,2),Oe=z(fe),Fe=z(Oe);L(Oe);var Ze=g(Oe,2);bn(Ze,21,()=>m(u)==="mm"?r:a,wn,(x,A)=>{var Z=fo(),V=z(Z,!0);L(Z),st(ve=>{Xe(Z,1,`px-3 py-1.5 text-sm font-semibold transition-colors ${m(h)===m(A)?"bg-green-500 text-white":"bg-gray-800 text-gray-400 hover:text-white"}`),be(V,ve)},[()=>B(m(A))]),pe("click",Z,()=>ee(h,m(A),!0)),$(x,Z)}),L(Ze),L(fe);var U=g(fe,2),H=z(U),T=g(H,2),p=g(z(T));L(T),L(U),L(he);var ne=g(he,2);{var C=x=>{var A=vo(),Z=z(A),V=g(Z);{var ve=_e=>{var Te=po();pe("click",Te,()=>{ee(f,"idle"),ee(w,"")}),$(_e,Te)};ct(V,_e=>{m(f)!=="uploading"&&_e(ve)})}L(A),st(()=>{Xe(A,1,`rounded-lg px-4 py-3 text-sm font-medium border ${m(G)??""}`),be(Z,`${m(w)??""} `)}),$(x,A)};ct(ne,x=>{m(f)!=="idle"&&x(C)})}var O=g(ne,2),j=z(O),b=z(j);L(j);var P=g(j,4),cn=z(P);L(P),L(O);var Dt=g(O,2),Mt=z(Dt);Un(Mt,{children:(x,A)=>{ho(x,{get dimX(){return m(N)},get dimY(){return m(q)},get dimZ(){return m(ie)},onAdjustX:Pe,onAdjustY:Ee,onAdjustZ:Ce})},$$slots:{default:!0}});var tt=g(Mt,2),St=g(z(tt),2),nt=z(St),Pt=g(z(nt),2),dn=g(Pt,2);L(nt);var it=g(nt,2),Et=g(z(it),2),hn=g(Et,2);L(it);var Ct=g(it,2),Ot=g(z(Ct),2),un=g(Ot,2);L(Ct),L(St),L(tt);var Tt=g(tt,2),It=g(z(Tt),2),ot=z(It),At=g(z(ot),2),fn=z(At);L(At),L(ot);var rt=g(ot,2),jt=g(z(rt),2),pn=z(jt);L(jt),L(rt);var Nt=g(rt,2),Lt=g(z(Nt),2),vn=z(Lt);L(Lt),L(Nt),L(It),L(Tt),L(Dt),L(De),st((x,A,Z,V,ve,_e,Te,at,Be)=>{Xe(le,1,`px-4 py-1.5 text-sm font-semibold transition-colors ${m(u)==="mm"?"bg-green-500 text-white":"bg-gray-800 text-gray-400 hover:text-white"}`),Xe(de,1,`px-4 py-1.5 text-sm font-semibold transition-colors ${m(u)==="in"?"bg-green-500 text-white":"bg-gray-800 text-gray-400 hover:text-white"}`),be(Fe,`Step (${m(u)??""}):`),T.disabled=m(f)==="uploading",be(p,` ${m(f)==="uploading"?"Uploading…":"Manufacture"}`),be(b,`Min: ${x??""} × ${A??""} × ${Z??""} ${m(u)??""}  (W × L × H)`),be(cn,`Max: ${V??""} × ${ve??""} × ${_e??""} ${m(u)??""}  (W × L × H)`),be(fn,`${Te??""} ${m(u)??""}`),be(pn,`${at??""} ${m(u)??""}`),be(vn,`${Be??""} ${m(u)??""}`)},[()=>B(l),()=>B(y),()=>B(E),()=>B(v),()=>B(_),()=>B(S),()=>B(m(Y)),()=>B(m(W)),()=>B(m(d))]),pe("click",le,()=>{ee(u,"mm"),ee(h,s)}),pe("click",de,()=>{ee(u,"in"),ee(h,c)}),pe("click",H,et),pe("click",T,oe),pe("click",Pt,()=>Pe(-1)),pe("click",dn,()=>Pe(1)),pe("click",Et,()=>Ee(-1)),pe("click",hn,()=>Ee(1)),pe("click",Ot,()=>Ce(-1)),pe("click",un,()=>Ce(1)),$(t,De),pt()}xn(["click"]);export{Co as default};
