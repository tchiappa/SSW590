import {Navbar, NavbarItem, NavbarSection} from './ui/navbar'
import { Sidebar } from './ui/sidebar'
import { StackedLayout } from './ui/stacked-layout'

export default function App({ children }:{ children: any; }) {
    return (
        <StackedLayout
            navbar={<Navbar><NavbarSection>
                <NavbarItem href="/">Home</NavbarItem>
            </NavbarSection></Navbar>}
            sidebar={<Sidebar></Sidebar>}
        >
            {children}
        </StackedLayout>
    )
}