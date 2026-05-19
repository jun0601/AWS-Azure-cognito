export const getCognitoTokensFromUrl = () => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    return {
      idToken: params.get("id_token"),
      accessToken: params.get("access_token"),
    };
};