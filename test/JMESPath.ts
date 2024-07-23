import typia from "typia";
import { JMESPath } from "../src/JMESPath";
/**
 * validate JMESPath type
 */

/**
 * @title 캠페인 조회 결과
 */
type IGetCampaignsOutput = IGetCampaignsOutputResult[];

/**
 * @title 캠페인 정보
 */
interface IGetCampaignsOutputResult {
  campaign: {
    id1: number;
    name1: string;
  };

  campaignBudget: {
    id2: number;
    name2: string;
  };
}

type Path1 = JMESPath<
  IGetCampaignsOutput,
  | "[].campaign.{value:id1, label:id1}"
  | "[].campaign.{value:id1, label:name1}"
  | "[].campaign.{value:name1, label:id1}"
  | "[].campaign.{value:name1, label:name1}"
  | "[].campaignBudget.{value:id2, label:id2}"
  | "[].campaignBudget.{value:id2, label:name2}"
  | "[].campaignBudget.{value:name2, label:id2}"
  | "[].campaignBudget.{value:name2, label:name2}"
>;

interface Example {
  arr1: {
    id1: number;
    name1: string;
  }[];
  arr2: {
    id2: number;
    name2: string;
    arr3: {
      id3: number;
      name3: string;
    }[];
  }[];
  otherProps: string;
}

type Path2 = JMESPath<
  Example,
  | "arr1[].{value:id1, label:id1}"
  | "arr1[].{value:id1, label:name1}"
  | "arr1[].{value:name1, label:id1}"
  | "arr1[].{value:name1, label:name1}"
  | "arr2[].arr3[].{value:id3, label:id3}"
  | "arr2[].arr3[].{value:id3, label:name3}"
  | "arr2[].arr3[].{value:name3, label:id3}"
  | "arr2[].arr3[].{value:name3, label:name3}"
  | "arr2[].{value:id2, label:id2}"
  | "arr2[].{value:id2, label:name2}"
  | "arr2[].{value:name2, label:id2}"
  | "arr2[].{value:name2, label:name2}"
>;

type Path3 = JMESPath<
  Example[],
  | "[].arr1[].{value:id1, label:id1}"
  | "[].arr1[].{value:id1, label:name1}"
  | "[].arr1[].{value:name1, label:id1}"
  | "[].arr1[].{value:name1, label:name1}"
  | "[].arr2[].arr3[].{value:id3, label:id3}"
  | "[].arr2[].arr3[].{value:id3, label:name3}"
  | "[].arr2[].arr3[].{value:name3, label:id3}"
  | "[].arr2[].arr3[].{value:name3, label:name3}"
  | "[].arr2[].{value:id2, label:id2}"
  | "[].arr2[].{value:id2, label:name2}"
  | "[].arr2[].{value:name2, label:id2}"
  | "[].arr2[].{value:name2, label:name2}"
  | "[].{value:otherProps, label:otherProps}"
>;

interface AdGroupAd {
  a: {
    b: string;
    c: number;
  };
  resourceName: string &
    typia.tags.Pattern<"(customers\\/[+-]?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?\\/adGroupAds\\/[+-]?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?~[+-]?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)">;
}

type Path4 = JMESPath<
  AdGroupAd[],
  | "[].resourceName.{value:resourceName, label:resourceName}"
  | "[].a.{value:b, label:b}"
  | "[].a.{value:b, label:c}"
  | "[].a.{value:c, label:b}"
  | "[].a.{value:c, label:c}"
>;
