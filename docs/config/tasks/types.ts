interface Base {
  name: string;
  description: string;
  type: string;
  location?: string;
}

export interface Details {
  isHelper: true | false;
  isRecipe: true | false;
  isTool: true | false;
  keywords?: string[];
}

export interface CSSClass extends Base {
  depth: number;
  id: number;
  className: string;
  details: Details;
  template?: string;
  preview: string;
  label: string;
  modifiers?: Modifier[];
  modifierList?: string[];
  section?: string;
}

export interface Modifier extends Base {
  className: string;
  usage?: (string | GithubDataItem)[];
  preview?: string;
  template?: string;
}

export interface Color extends Base {
  value: string;
  check?: {
    aa: boolean;
    aaa: boolean;
    aaLargeText: boolean;
  };
}

export interface ColorMap extends Base {
  list: Color[];
}

export interface Token extends Base {
  value: string;
}

export interface TokenMap extends Base {
  list: Token[];
  details: Details;
}

export interface Section extends Base {
  depth: number;
  slug?: string;
  id: number;
  list?: {
    className: string;
    name: string;
  }[];
}

// Main data
export interface Sorted {
  sections: Section[];
  cssClasses: CSSClass[];
  colorMaps: ColorMap[];
  modifiers: Modifier;
  modifierMap: Modifier[];
  tokenMaps: TokenMap[];
  usage: GithubDataItem;
  fullList: string[];
  tokens: string[];
  colors: string[];
}

// Third party
export interface KSSData {
  meta: {
    depth: number;
    styleGuide: {
      meta: {
        autoInit: boolean;
        files: object;
        hasNumericReferences: boolean;
        needsDepth: boolean;
        needsReferenceNumber: boolean;
        needsSort: boolean;
        referenceMap: object;
        weightMap: object;
      };
      data: object;
    };
  };
  data: {
    header: string;
    modifiers?: KSSModifier[];
    reference: string;
    description: string;
    colors?: {
      color: string;
      name: string;
      description: string;
    }[];
    parameters?: KSSParameter[];
    source: {
      filename: string;
      path: string;
      line: number;
    };
    markup: string;
  };
}
export interface KSSModifier {
  data: {
    name: string;
    description: string;
    className: string;
  };
}
export interface KSSParameter {
  data: {
    name: string;
    description: string;
    defaultValue: string;
  };
}
export interface GithubDataItem {
  repo: string;
  total_count: number;
  results: [
    {
      label: string;
      url: string;
    }
  ];
}
export interface GithubData {
  lastUpdated: string;
  formattedDate: string;
  formattedTime: string;
  classData: {
    [key: string]: {
      searchDataArr: GithubDataItem[];
    };
  };
}
