import { prisma } from "../lib";

export type SubProfileType = "candidate" | "company";

export async function getSubProfileById(
  id: string,
  typeOrOptions?:
    | SubProfileType
    | {
        include?: object;
        includeProfile?: boolean;
      },
  maybeOptions: {
    include?: object;
    includeProfile?: boolean;
  } = {}
): Promise<{
  subProfile: any;
  type: SubProfileType;
} | null> {
  let type: SubProfileType | undefined;
  let options: { include?: object; includeProfile?: boolean };

  if (typeof typeOrOptions === "string") {
    type = typeOrOptions as SubProfileType;
    options = maybeOptions;
  } else {
    options = typeOrOptions || {};
  }

  const defaultInclude = {
    agent: { include: { documents: true } },
    techStack: true,
    profile: options.includeProfile ? { include: { documents: true } } : true,
  };

  const include = { ...defaultInclude, ...options.include };

  if (type === "candidate") {
    const candidate = await prisma.candidateProfile.findUnique({
      where: { id },
      include,
    });
    return candidate ? { subProfile: candidate, type: "candidate" } : null;
  }

  if (type === "company") {
    const company = await prisma.companyProfile.findUnique({
      where: { id },
      include,
    });
    return company ? { subProfile: company, type: "company" } : null;
  }

  const candidate = await prisma.candidateProfile.findUnique({
    where: { id },
    include,
  });
  if (candidate) return { subProfile: candidate, type: "candidate" };

  const company = await prisma.companyProfile.findUnique({
    where: { id },
    include,
  });
  if (company) return { subProfile: company, type: "company" };

  return null;
}
