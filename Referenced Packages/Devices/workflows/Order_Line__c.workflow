<?xml version="1.0" encoding="UTF-8"?>
<Workflow xmlns="http://soap.sforce.com/2006/04/metadata">
    <alerts>
        <fullName>Email_alert_Order_line_with_blank_lot_serial_when_Order_header_status_Shipped</fullName>
        <description>Email alert - Order line with blank lot serial when Order header status is Shipped</description>
        <protected>false</protected>
        <recipients>
            <recipient>devices121@gw.com</recipient>
            <type>user</type>
        </recipients>
        <senderType>CurrentUser</senderType>
        <template>DW_Folder/Email_alert_Order_line_with_blank_lot_and_serial</template>
    </alerts>
    <alerts>
        <fullName>Email_alert_Order_line_with_blank_lot_serial_when_Order_header_status_Shippped</fullName>
        <description>Email alert - Order line with blank lot serial when Order header status is Shippped</description>
        <protected>false</protected>
        <recipients>
            <recipient>devices121@gw.com</recipient>
            <type>user</type>
        </recipients>
        <senderType>CurrentUser</senderType>
        <template>DW_Folder/Email_alert_Order_line_with_blank_lot_and_serial</template>
    </alerts>
    <rules>
        <fullName>Email alert%3A Order line with blank lot serial</fullName>
        <actions>
            <name>Email_alert_Order_line_with_blank_lot_serial_when_Order_header_status_Shipped</name>
            <type>Alert</type>
        </actions>
        <actions>
            <name>Email_alert_Order_line_with_blank_lot_serial_when_Order_header_status_Shippped</name>
            <type>Alert</type>
        </actions>
        <active>true</active>
        <booleanFilter>1 AND (2 OR 3) AND (4 OR 5)</booleanFilter>
        <criteriaItems>
            <field>Inventory_Order__c.Status__c</field>
            <operation>equals</operation>
            <value>Shipped</value>
        </criteriaItems>
        <criteriaItems>
            <field>Order_Line__c.Serial_Number__c</field>
            <operation>equals</operation>
        </criteriaItems>
        <criteriaItems>
            <field>Order_Line__c.Serial_Number__c</field>
            <operation>equals</operation>
        </criteriaItems>
        <criteriaItems>
            <field>Order_Line__c.Lot_Number__c</field>
            <operation>equals</operation>
        </criteriaItems>
        <criteriaItems>
            <field>Order_Line__c.Lot_Number__c</field>
            <operation>equals</operation>
        </criteriaItems>
        <description>Message is sent when Order line with blank lot serial</description>
        <triggerType>onAllChanges</triggerType>
    </rules>
</Workflow>
