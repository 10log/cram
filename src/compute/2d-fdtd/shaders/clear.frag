uniform sampler2D clearTexture;

void main()	{

	vec2 cellSize = 1.0 / resolution.xy;

	vec2 uv = gl_FragCoord.xy * cellSize;


	vec4 textureValue = texture2D( clearTexture, uv );

	// Rest is zero in the state (#224).
	textureValue.r = 0.0;
	textureValue.g = 0.0;
	// The previous velocity frequency-dependent walls read (#222).
	textureValue.b = 0.0;

	gl_FragColor = textureValue;

}
