import {Navbar, NavbarItem, NavbarSection} from './components/navbar'
import { Sidebar } from './components/sidebar'
import { StackedLayout } from './components/stacked-layout'

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