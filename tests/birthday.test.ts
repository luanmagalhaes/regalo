import { describe, expect, it } from "vitest";
import {
  ageTurning,
  birthdayLabel,
  countdownLabel,
  currentAge,
  daysUntilBirthday,
  isLeapYear,
  isNear,
  nearWindow,
  parseBirthday,
  sortByNextBirthday,
} from "@/lib/birthday";

const day = (value: string) => new Date(`${value}T12:00:00`);

describe("leitura da data", () => {
  it("aceita uma data que existe", () => {
    expect(parseBirthday("1994-03-27")).toEqual({ year: 1994, month: 3, day: 27 });
  });

  it("recusa 31 de fevereiro", () => {
    expect(parseBirthday("1994-02-31")).toBeNull();
  });

  it("recusa 29 de fevereiro fora de ano bissexto", () => {
    expect(parseBirthday("1995-02-29")).toBeNull();
    expect(parseBirthday("1996-02-29")).not.toBeNull();
  });

  it("recusa mês que não existe e formato torto", () => {
    expect(parseBirthday("1994-13-01")).toBeNull();
    expect(parseBirthday("27/03/1994")).toBeNull();
    expect(parseBirthday("")).toBeNull();
    expect(parseBirthday(null)).toBeNull();
  });

  it("sabe quais anos são bissextos", () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(1900)).toBe(false);
    expect(isLeapYear(2000)).toBe(true);
  });
});

describe("contagem até o aniversário", () => {
  it("devolve zero no próprio dia", () => {
    expect(daysUntilBirthday("1994-09-14", day("2026-09-14"))).toBe(0);
  });

  it("devolve um quando é amanhã", () => {
    expect(daysUntilBirthday("1994-09-15", day("2026-09-14"))).toBe(1);
  });

  it("pula para o ano seguinte quando a data já passou", () => {
    expect(daysUntilBirthday("1994-09-13", day("2026-09-14"))).toBe(364);
  });

  it("atravessa a virada do ano", () => {
    expect(daysUntilBirthday("1994-01-02", day("2026-12-30"))).toBe(3);
  });

  it("comemora 29 de fevereiro em 1º de março quando o ano não é bissexto", () => {
    expect(daysUntilBirthday("1996-02-29", day("2027-02-27"))).toBe(2);
    expect(daysUntilBirthday("1996-02-29", day("2028-02-27"))).toBe(2);
  });

  it("devolve nulo sem data preenchida", () => {
    expect(daysUntilBirthday(null, day("2026-09-14"))).toBeNull();
  });
});

describe("idade", () => {
  it("conta a idade de agora e a que vem no próximo aniversário", () => {
    expect(currentAge("1994-09-20", day("2026-09-14"))).toBe(31);
    expect(ageTurning("1994-09-20", day("2026-09-14"))).toBe(32);
  });

  it("no dia do aniversário já conta a idade nova", () => {
    expect(currentAge("1994-09-14", day("2026-09-14"))).toBe(32);
  });

  it("conta certo depois da data no mesmo ano", () => {
    expect(currentAge("1994-01-10", day("2026-09-14"))).toBe(32);
    expect(ageTurning("1994-01-10", day("2026-09-14"))).toBe(33);
  });
});

describe("janela de aviso", () => {
  it("avisa a partir de quinze dias antes", () => {
    expect(isNear("1994-09-29", day("2026-09-14"))).toBe(true);
    expect(nearWindow).toBe(15);
  });

  it("não avisa com dezesseis dias", () => {
    expect(isNear("1994-09-30", day("2026-09-14"))).toBe(false);
  });

  it("não avisa quem não tem data", () => {
    expect(isNear(null, day("2026-09-14"))).toBe(false);
  });
});

describe("texto mostrado", () => {
  it("escreve a contagem em português", () => {
    expect(countdownLabel(0)).toBe("É hoje!");
    expect(countdownLabel(1)).toBe("Amanhã");
    expect(countdownLabel(12)).toBe("Em 12 dias");
    expect(countdownLabel(null)).toBe("Aniversário ainda não preenchido");
  });

  it("escreve o dia e o mês por extenso", () => {
    expect(birthdayLabel("1994-03-27")).toBe("27 de março");
    expect(birthdayLabel(null)).toBeNull();
  });
});

describe("ordem do tracker", () => {
  it("coloca primeiro quem faz aniversário antes e joga sem data para o fim", () => {
    const people = [
      { name: "Flabio", birthday: null },
      { name: "Luan", birthday: "1994-12-30" },
      { name: "Milla", birthday: "1994-09-20" },
      { name: "MaryJane", birthday: "1994-09-16" },
    ];

    expect(sortByNextBirthday(people, day("2026-09-14")).map((person) => person.name)).toEqual([
      "MaryJane",
      "Milla",
      "Luan",
      "Flabio",
    ]);
  });

  it("desempata pelo nome", () => {
    const people = [
      { name: "Yuri", birthday: "1994-09-20" },
      { name: "Bia", birthday: "1994-09-20" },
    ];

    expect(sortByNextBirthday(people, day("2026-09-14")).map((person) => person.name)).toEqual([
      "Bia",
      "Yuri",
    ]);
  });
});
