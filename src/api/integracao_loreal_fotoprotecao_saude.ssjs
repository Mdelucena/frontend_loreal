<script runat="server">
    Platform.Load("Core", "1.1.5");

    // CORS headers
    Platform.Response.SetResponseHeader(
        "Access-Control-Allow-Origin",
        "https://cloud.mail.kerastase.com.br"
    );
    Platform.Response.SetResponseHeader("Access-Control-Allow-Methods", "POST");
    Platform.Response.SetResponseHeader(
        "Access-Control-Allow-Headers",
        "Authorization, Content-Type"
    );

    // Security headers
    Platform.Response.SetResponseHeader("Set-Cookie", "Secure; HttpOnly");
    Platform.Response.SetResponseHeader(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains"
    );
    Platform.Response.SetResponseHeader("X-XSS-Protection", "1; mode=block");
    Platform.Response.SetResponseHeader("X-Frame-Options", "DENY");
    Platform.Response.SetResponseHeader("X-Content-Type-Options", "nosniff");
    Platform.Response.SetResponseHeader(
        "Referrer-Policy",
        "strict-origin-when-cross-origin"
    );
    Platform.Response.SetResponseHeader(
        "Content-Security-Policy",
        "default-src 'self'"
    );

    // Recebendo dados da requisição POST
    var payload = Platform.Request.GetPostData();
    var payloadObj = Platform.Function.ParseJSON(payload);

    // Definindo informações da Data Extension
    var deName = payloadObj.deName;
    var fields = payloadObj.fields;

    // Inserindo a Row na Data Extension
    if (deName) {
        try {
            var de = DataExtension.Init(deName);
            try {
                de.Rows.Add(fields);
                Write('{"message":"Sucesso","statusCode": 200}');
            } catch (err) {
                Write(err);
            }
        } catch (err) {
            Write(
                '{"message":"Não foi possível consultar as informações.","statusCode": 500}'
            );
        }
    } else {
        Write('{"message":"Nome da Data Extension inválido","statusCode": 404}');
    }
</script>