import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  Link,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import ProfileModal from "./ProfileModal";
import { ChatState } from "../../Context/ChatProvider";
import { useHistory } from "react-router-dom";

const NAV_ITEMS = [
  {
    label: "Home",
    href: "/dashboard", // Update href for Home to match the default dashboard URL
  },
  {
    label: "Chats",
    href: "/chats",
  },
  {
    label: "Canvas",
    href: "#",
  },
  {
    label: "TaskFlow",
    href: "/taskflow",
  },
  {
    label: "Feedback",
    href: "/feedback",
  },
  {
    label: "Notifications",
    href: "#",
  },
  {
    label: "Documents",
    href: "#",
  },

];

export default function Header() {
  const { user } = ChatState();
  const history = useHistory();
  const [redirectUrl, setRedirectUrl] = useState("/dashboard");

  const textColor = useColorModeValue("gray.800", "white");
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const hoverTextColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.900");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");
    if (userId && role) {
      let url = "/dashboard"; // Default redirection URL
      switch (role) {
        case "admin":
          url = "/admin-dashboard";
          break;
        case "architect":
          url = "/architect-dashboard";
          break;
        // Add more cases if there are additional roles
        default:
          break;
      }
      setRedirectUrl(url);
    }
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const handleHomeClick = () => {
    history.push(redirectUrl); // Programmatically navigate to redirectUrl
  };

  return (
    <Flex
      backgroundColor="#EEF7FF"
      color={textColor}
      height="60px"
      paddingLeft="4"
      paddingRight="4"
      borderBottomWidth="1"
      borderStyle="solid"
      borderColor={borderColor}
      alignItems="center"
      justifyContent="space-between"
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="999"
      width="100%"
    >
      <Text
        fontFamily="heading"
        fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
        paddingLeft={{ base: "4", md: "6", lg: "8" }}
      >
        ArcTec
      </Text>

      <Stack direction="row" spacing={4} alignItems="center">
        {NAV_ITEMS.map((navItem) => (
          <Link
            key={navItem.label === "Home" ? "home" : navItem.label}
            padding="2"
            href={
              navItem.href === "/dashboard" ? redirectUrl : navItem.href
            }
            fontSize="sm"
            fontWeight="500"
            color={linkColor}
            _hover={{
              textDecoration: "none",
              color: hoverTextColor,
            }}
          >
            {navItem.label}
          </Link>
        ))}
      </Stack>

      <Stack paddingRight={{ base: "4", md: "6", lg: "8" }}>
        <Menu>
          <MenuButton
            as={Button}
            backgroundColor="#D6EEFA"
            rightIcon={<ChevronDownIcon />}
            height="48px"
          >
            {user && user.name ? (
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            ) : (
              <Avatar size="sm" cursor="pointer" />
            )}
          </MenuButton>
          <MenuList>
            <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>
            </ProfileModal>
            <MenuDivider />
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Stack>
    </Flex>
  );
}
