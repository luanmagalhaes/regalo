import { beforeAll, describe, expect, it } from "vitest";
import {
  asMaster,
  ownsProfile,
  packClaims,
  readClaims,
  withProfile,
  withoutProfile,
} from "@/lib/profiles/owner";
import { hashPin, isMasterPin, isPinShaped, pinMatches } from "@/lib/profiles/pin";

beforeAll(() => {
  process.env.REGALO_PASSPHRASE = "segredo-de-teste";
  process.env.REGALO_MASTER_PIN = "9137";
});

const fresh = () => ({ ids: [] as string[], master: false, exp: Date.now() + 60_000 });

describe("formato do PIN", () => {
  it("aceita só quatro números", () => {
    expect(isPinShaped("1234")).toBe(true);
    expect(isPinShaped("12345")).toBe(false);
    expect(isPinShaped("12a4")).toBe(false);
    expect(isPinShaped("")).toBe(false);
    expect(isPinShaped(1234)).toBe(false);
  });
});

describe("guarda do PIN", () => {
  it("confere o PIN certo e recusa o errado", () => {
    const stored = hashPin("4242");

    expect(pinMatches("4242", stored)).toBe(true);
    expect(pinMatches("4243", stored)).toBe(false);
  });

  it("nunca guarda o PIN em texto puro", () => {
    expect(hashPin("4242")).not.toContain("4242");
  });

  it("gera hash diferente para o mesmo PIN", () => {
    expect(hashPin("4242")).not.toBe(hashPin("4242"));
  });

  it("recusa qualquer PIN quando não existe hash guardado", () => {
    expect(pinMatches("4242", null)).toBe(false);
    expect(pinMatches("4242", "formato-estranho")).toBe(false);
  });

  it("reconhece a senha mestre", () => {
    expect(isMasterPin("9137")).toBe(true);
    expect(isMasterPin("1111")).toBe(false);
  });
});

describe("crachá de dono", () => {
  it("guarda e lê os perfis liberados", () => {
    const claims = withProfile(fresh(), "perfil-1");
    const token = packClaims(claims);

    expect(readClaims(token).ids).toEqual(["perfil-1"]);
    expect(ownsProfile(readClaims(token), "perfil-1")).toBe(true);
    expect(ownsProfile(readClaims(token), "perfil-2")).toBe(false);
  });

  it("recusa crachá adulterado", () => {
    const token = packClaims(withProfile(fresh(), "perfil-1"));
    const [payload] = token.split(".");
    const forged = `${payload}.assinaturaInventada`;

    expect(readClaims(forged).ids).toEqual([]);
  });

  it("recusa crachá vencido", () => {
    const token = packClaims({ ids: ["perfil-1"], master: false, exp: Date.now() - 1000 });

    expect(readClaims(token).ids).toEqual([]);
  });

  it("modo dono da casa abre qualquer perfil", () => {
    const claims = asMaster(fresh());

    expect(ownsProfile(claims, "qualquer-perfil")).toBe(true);
  });

  it("sair do perfil tira o acesso", () => {
    const entrou = withProfile(fresh(), "perfil-1");
    const saiu = withoutProfile(entrou, "perfil-1");

    expect(ownsProfile(saiu, "perfil-1")).toBe(false);
  });

  it("não duplica o mesmo perfil", () => {
    const duas = withProfile(withProfile(fresh(), "perfil-1"), "perfil-1");

    expect(duas.ids).toEqual(["perfil-1"]);
  });
});
