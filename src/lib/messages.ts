export const statusMessages: Record<number, string> = {
  400: "Esse pedido não fez sentido para o Regalo.",
  401: "A senha da turma não vale mais. Entre de novo.",
  403: "Essa ação não está liberada aqui.",
  404: "Não encontrei esse perfil.",
  409: "Alguém mexeu nisso antes de você. Recarregue a lista.",
  413: "Isso ficou grande demais para guardar.",
  422: "Faltou preencher alguma coisa.",
  429: "Muitos toques seguidos. Espere um instante.",
  500: "O Regalo tropeçou aqui do lado do servidor.",
  502: "O Regalo está fora do ar por um instante.",
  503: "O Regalo está fora do ar por um instante.",
  504: "O Regalo demorou demais para responder.",
};

export const fallbackMessage = "Algo deu errado. Tente de novo.";
export const unreadableMessage = "O servidor respondeu de um jeito que não entendi.";
export const offlineMessage = "Você está sem internet. A lista volta quando a conexão voltar.";
export const unreachableMessage = "Não consegui falar com o Regalo. Tentando de novo.";

export function messageForStatus(status: number): string {
  return statusMessages[status] ?? fallbackMessage;
}

export function networkMessage(online: boolean): string {
  return online ? unreachableMessage : offlineMessage;
}
