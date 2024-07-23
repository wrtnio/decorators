import { tags } from "typia";
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
  /**
   * `customers/${number}/adGroupAds/${number}~${number}` 형식
   *
   * @title 광고 그룹 광고의 리소스 명
   */
  resourceName: string &
    tags.Pattern<"(customers\\/[+-]?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?\\/adGroupAds\\/[+-]?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?~[+-]?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)">;

  /**
   * @title 광고 심사 및 정책에 대한 평가 내역
  
  '[].policySummary.{value:approvalStatus, label:approvalStatus}'|
  | '[].policySummary.{value:approvalStatus, label:reviewStatus}'
  | '[].policySummary.{value:reviewStatus, label:approvalStatus}'
  | '[].policySummary.{value:reviewStatus, label:reviewStatus}'
  | '[].{value:policySummary.reviewStatus, label:policySummary.reviewStatus}'
  | '[].{value:resourceName, label:resourceName}' 
  |'[].{value:status, label:status}'*/
  policySummary: {
    /**
     * @title 광고의 승인 여부
     * @description 구글에서 해당 광고가 송출되어도 무방한지 판단한 내용입니다.
     */
    approvalStatus:
      | tags.Constant<"APPROVED", { title: "승인됨" }>
      | tags.Constant<"APPROVED_LIMITED", { title: "제한된 승인" }>
      | tags.Constant<
          "AREA_OF_INTEREST_ONLY",
          { title: "특정 영역에 대한 허용" }
        >
      | tags.Constant<"DISAPPROVED", { title: "비승인" }>
      | tags.Constant<"UNKNOWN", { title: "알 수 없음" }>
      | tags.Constant<"UNSPECIFIED", { title: "명시되지 않음" }>;

    reviewStatus:
      | tags.Constant<"ELIGIBLE_MAY_SERVE", { title: "자격을 갖춤" }>
      | tags.Constant<"REVIEWED", { title: "검토되었음" }>
      | tags.Constant<"REVIEW_IN_PROGRESS", { title: "검토 중임" }>
      | tags.Constant<"UNDER_APPEAL", { title: "심사 중임" }>
      | tags.Constant<"UNKNOWN", { title: "알 수 없음" }>
      | tags.Constant<"UNSPECIFIED", { title: "명시되지 않음" }>;
  };

  status: string & tags.Constant<"A", { title: "A" }>;
}

type IGetAdGroupAdOutput = Pick<
  AdGroupAd,
  "resourceName" | "policySummary" | "status"
>[];

type Path4 = JMESPath<
  IGetAdGroupAdOutput,
  | "[].policySummary.{value:approvalStatus, label:approvalStatus}"
  | "[].policySummary.{value:approvalStatus, label:reviewStatus}"
  | "[].policySummary.{value:reviewStatus, label:approvalStatus}"
  | "[].policySummary.{value:reviewStatus, label:reviewStatus}"
  | "[].{value:policySummary.reviewStatus, label:policySummary.reviewStatus}"
  | "[].{value:resourceName, label:resourceName}"
  | "[].{value:status, label:status}"
  | "[].{value:policySummary.approvalStatus, label:policySummary.approvalStatus}"
>;
