<?xml version="1.0" encoding="UTF-8"?>
<Workflow xmlns="http://soap.sforce.com/2006/04/metadata">
    <alerts>
        <fullName>PIR_Overdue</fullName>
        <ccEmails>musman@greatwavetech.com</ccEmails>
        <description>PIR Overdue</description>
        <protected>false</protected>
        <senderType>CurrentUser</senderType>
        <template>DW_Folder/PIR_Overdue</template>
    </alerts>
    <rules>
        <fullName>PIR Overdue</fullName>
        <actions>
            <name>PIR_Overdue</name>
            <type>Alert</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>PIR__c.Status__c</field>
            <operation>equals</operation>
            <value>Overdue</value>
        </criteriaItems>
        <triggerType>onCreateOrTriggeringUpdate</triggerType>
    </rules>
</Workflow>
