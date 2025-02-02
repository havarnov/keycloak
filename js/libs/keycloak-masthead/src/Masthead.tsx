import {
  Avatar,
  AvatarProps,
  Brand,
  BrandProps,
  DropdownItem,
  PageHeader,
  PageHeaderProps,
  PageHeaderTools,
  PageHeaderToolsGroup,
  PageHeaderToolsItem,
} from "@patternfly/react-core";
import Keycloak from "keycloak-js";
import { ReactNode } from "react";

import { KeycloakDropdown } from "./KeycloakDropdown";
import { useTranslation } from "./translation/useTranslation";
import { loggedInUserName } from "./util";
import { DefaultAvatar } from "./DefaultAvatar";

type BrandLogo = BrandProps & {
  onClick?: () => void;
};

type KeycloakMastheadProps = PageHeaderProps & {
  brand: BrandLogo;
  avatar?: AvatarProps;
  features?: {
    hasLogout?: boolean;
    hasManageAccount?: boolean;
    hasUsername?: boolean;
  };
  keycloak?: Keycloak;
  kebabDropdownItems?: ReactNode[];
  dropdownItems?: ReactNode[];
  toolbarItems?: ReactNode[];
};

const KeycloakMasthead = ({
  brand: { onClick: onBrandLogoClick, ...brandProps },
  avatar,
  features: {
    hasLogout = true,
    hasManageAccount = true,
    hasUsername = true,
  } = {},
  keycloak,
  kebabDropdownItems,
  dropdownItems = [],
  toolbarItems,
  ...rest
}: KeycloakMastheadProps) => {
  const { t } = useTranslation();
  const extraItems = [];
  if (hasManageAccount) {
    extraItems.push(
      <DropdownItem
        key="manageAccount"
        onClick={() => keycloak?.accountManagement()}
      >
        {t("manageAccount")}
      </DropdownItem>
    );
  }
  if (hasLogout) {
    extraItems.push(
      <DropdownItem key="signOut" onClick={() => keycloak?.logout()}>
        {t("signOut")}
      </DropdownItem>
    );
  }

  const picture = keycloak?.tokenParsed?.picture;
  return (
    <PageHeader
      {...rest}
      logo={
        <div onClick={onBrandLogoClick}>
          <Brand {...brandProps} />
        </div>
      }
      logoComponent="div"
      headerTools={
        <PageHeaderTools>
          <PageHeaderToolsGroup>
            <PageHeaderToolsItem
              visibility={{
                md: "hidden",
              }}
            >
              <KeycloakDropdown
                isKebab
                dropDownItems={[
                  ...(kebabDropdownItems || dropdownItems),
                  extraItems,
                ]}
              />
            </PageHeaderToolsItem>
            <PageHeaderToolsItem>{toolbarItems}</PageHeaderToolsItem>
            <PageHeaderToolsItem
              visibility={{
                default: "hidden",
                md: "visible",
              }}
            >
              <KeycloakDropdown
                dropDownItems={[...dropdownItems, extraItems]}
                title={
                  hasUsername && keycloak
                    ? loggedInUserName(keycloak, t)
                    : undefined
                }
              />
            </PageHeaderToolsItem>
          </PageHeaderToolsGroup>
          {picture || avatar?.src ? (
            <Avatar {...{ src: picture, alt: t("avatar"), ...avatar }} />
          ) : (
            <DefaultAvatar {...avatar} />
          )}
        </PageHeaderTools>
      }
    />
  );
};

export default KeycloakMasthead;
